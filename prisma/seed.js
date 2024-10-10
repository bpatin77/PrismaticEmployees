const prisma = require("../prisma");
const seed = async () => {

  await prisma.employee.createMany({
    data: Array.from({ length: 10 }, (_, i) => ({ name: `Employee ${i}` })),
  });
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
