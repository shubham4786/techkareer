import { PrismaClient } from '@prisma/client';
 
const prisma = new PrismaClient();

async function main() {
    const author = await prisma.author.upsert({
        where: { id: '6b041df1-d459-4537-92da-ffcc767a6e50' },
        update: {},
        create: {
            userid: 'itsharshag',
            name: 'Harsh Agrawal',
            description: "Hello world",
            org: "Devkit"
        }
    })
    console.log({ author });
    
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e: any) => {
        console.log(e);
        await prisma.$disconnect();
        process.exit(1);        
    })