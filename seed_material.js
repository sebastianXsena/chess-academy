const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Primero necesitamos un autor, buscaremos o crearemos un admin
  let admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!admin) {
    console.log("No hay ADMIN, creando uno temporal...");
    admin = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'Sistema',
        username: 'admin_sistema',
        email: 'admin@chessacademy.com',
        password: 'password', // esto fallaría el login normal sin hash, pero sirve para la fk
        role: 'ADMIN'
      }
    });
  }

  const material = await prisma.material.create({
    data: {
      title: 'El Movimiento de las Piezas',
      description: 'Guía esencial en formato PDF para aprender cómo se mueve cada pieza en el tablero, sus reglas especiales como el enroque y la captura al paso.',
      contentUrl: 'https://cdn.worldchess.com/static/pdfs/FIDE_Laws_of_Chess_2018.pdf', // Un PDF de ejemplo sobre ajedrez
      isPremium: false,
      authorId: admin.id
    }
  });

  console.log('Material creado:', material);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
