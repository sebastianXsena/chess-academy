const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.material.updateMany({
    where: { title: 'El Movimiento de las Piezas' },
    data: {
      contentUrl: 'https://handbook.fide.com/files/handbook/E012023.pdf'
    }
  });

  console.log('Material actualizado con URL válida');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
