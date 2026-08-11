import { PrismaClient, ApplicationStatus, WorkMode, EmploymentType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean slate for repeatable seeding
  await prisma.statusHistoryEntry.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      passwordHash,
      name: "Demo User",
    },
  });

  const applicationsData = [
    {
      company: "Acme Corp",
      jobTitle: "Frontend Engineering Intern",
      workMode: WorkMode.REMOTE,
      employmentType: EmploymentType.INTERNSHIP,
      status: ApplicationStatus.INTERVIEW,
      source: "LinkedIn",
      applicationDate: new Date("2026-06-01"),
      deadline: new Date("2026-06-15"),
    },
    {
      company: "Globex",
      jobTitle: "Software Engineer New Grad",
      workMode: WorkMode.HYBRID,
      employmentType: EmploymentType.FULL_TIME,
      status: ApplicationStatus.APPLIED,
      source: "Company website",
      applicationDate: new Date("2026-07-10"),
      deadline: null,
    },
    {
      company: "Initech",
      jobTitle: "Backend Intern",
      workMode: WorkMode.ONSITE,
      employmentType: EmploymentType.INTERNSHIP,
      status: ApplicationStatus.REJECTED,
      source: "Referral",
      applicationDate: new Date("2026-05-20"),
      deadline: null,
    },
    {
      company: "Umbrella Inc",
      jobTitle: "Full Stack Developer",
      workMode: WorkMode.REMOTE,
      employmentType: EmploymentType.FULL_TIME,
      status: ApplicationStatus.OFFER,
      source: "Career fair",
      applicationDate: new Date("2026-04-15"),
      deadline: null,
    },
  ];

  for (const data of applicationsData) {
    const application = await prisma.application.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    await prisma.statusHistoryEntry.create({
      data: {
        applicationId: application.id,
        fromStatus: null,
        toStatus: ApplicationStatus.SAVED,
        changedAt: data.applicationDate!,
      },
    });

    await prisma.statusHistoryEntry.create({
      data: {
        applicationId: application.id,
        fromStatus: ApplicationStatus.SAVED,
        toStatus: data.status,
        changedAt: data.applicationDate!,
      },
    });
  }

  console.log(`Seeded 1 user and ${applicationsData.length} applications.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });