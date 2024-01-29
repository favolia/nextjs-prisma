const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
async function main() {
    const data = await prisma.todo.create({
        data: {
            title: "Pukul orang",
            description: "siapa saja yang lo liat.",
            isChecked: true
        }
    })
    console.log(data)
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })