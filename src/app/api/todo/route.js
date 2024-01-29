const { prisma } = require("@/lib/prisma");
const { NextResponse } = require("next/server");

export async function GET(request) {
    const params = param => request.nextUrl.searchParams.get(param)
    const id = params('id')

    const data = await prisma.todo.findMany()

    return NextResponse.json(data, { status: 200 })
}

export async function PATCH(req) {
    const { isChecked, id } = await req.json();

    await prisma.todo.update({
        where: {
            id: id,
        },
        data: {
            isChecked: isChecked,
        },
    });
    console.log({isChecked,id})
    return NextResponse.json({ message: "Updated" }, { status: 200 });
}

export const PUT = async () => {
    try {
        const { isChecked } = await req.json()
        const id = req.url.split("todo/")[1];
        console.log(id)

        await prisma.todo.update({
            where: {
                id: id,
            },
            data: {
                isChecked: isChecked,
            },
        });

        return NextResponse.json({ message: "Updated" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Bad Request anjing" }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const { title, description, isChecked } = await req.json()

        await prisma.todo.create({
            data: {
                title,
                description: description || "",
                isChecked,
            }
        })
        return NextResponse.json({ message: "Created new todo" }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
    }
}

export async function DELETE(req) {
    const { id } = await req.json();

    await prisma.todo.delete({
        where: {
            id: id,
        },
    });
    return NextResponse.json({ message: "Deleted Item" }, { status: 200 });
}
