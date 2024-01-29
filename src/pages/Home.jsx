'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Checkbox } from "@/components/ui/checkbox"
import { Toaster, toast } from 'sonner'
import axios from 'axios';
import { useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { TbEdit } from "react-icons/tb";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

const Home = () => {
    const [todo, setTodo] = useState();
    const [todoTitle, setTodoTitle] = useState("")
    const [todoDesc, setTodoDesc] = useState("")
    const [todoIsChecked, setTodoIsChecked] = useState(false)

    const router = useRouter()

    useEffect(() => {
        fetchAllData()
    }, []);

    async function fetchAllData() {
        try {
            const { data } = await axios.get('/api/todo');
            setTodo(data)
        } catch (error) {
            console.log({ error });
        }
    }

    const deleteTodo = async (td) => {
        try {
            await axios.delete(`/api/todo`, {
                data: {
                    id: td.id
                }
            })
            fetchAllData()
        } catch (error) {
            console.log({ error });
        }

    }

    const updateTodo = async (td) => {
        try {
            await axios.patch(`/api/todo`, {
                // method: 'PATCH',
                id: td.id,
                isChecked: !td.isChecked,
            })
            fetchAllData()
        } catch (error) {
            console.log({ error });
        }
    }

    const create = async (e) => {
        e.preventDefault();

        // Pastikan variabel sudah didefinisikan
        if (!todoTitle) {
            return toast.warning("title tidak boleh kosong!");
        }

        console.log({
            todoTitle,
            todoDesc,
            todoIsChecked
        });

        try {
            await axios('/api/todo', {
                method: "POST",
                data: {
                    title: todoTitle,
                    description: todoDesc,
                    isChecked: todoIsChecked
                }
            });

            
            toast.success("Successfully added.");
            fetchAllData()
            
            setTodoTitle("")
            setTodoDesc("")
            setTodoIsChecked(false)
            // Panggil fetchAllData setelah pemanggilan berhasil
            
        } catch (error) {
            // Gunakan toast.error untuk menangani error pada Axios
            console.error("Error during Axios post:", error);

            // Tampilkan pesan error yang lebih spesifik jika tersedia
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong.");
            }
        }
    };


    return (
        <>
            <Toaster richColors />
            <main className='w-full min-h-screen px-10 py-2'>

                <Drawer>
                    <DrawerTrigger>
                        <div className={buttonVariants({ variant: "default" })}>
                            Add new todo
                        </div>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <form onSubmit={create}>
                                <DrawerTitle className="my-5">Title</DrawerTitle>
                                <Input type="text" value={todoTitle} placeholder="Title" onChange={(e) => setTodoTitle(e.target.value)} />
                                <DrawerTitle className="my-5">Complete</DrawerTitle>
                                <Checkbox defaultChecked={false} onCheckedChange={(e) => setTodoIsChecked(e)} />
                                <DrawerTitle className="my-5">Description</DrawerTitle>
                                <Textarea value={todoDesc} onChange={(e) => setTodoDesc(e.target.value)} placeholder="Type description here." />
                                <Separator className="my-6" />
                                <div className="w-full">
                                    <Button className="w-full" type="submit">Submit</Button>
                                </div>
                            </form>
                        </DrawerHeader>
                        <DrawerFooter>
                            <DrawerClose>
                                <div className={buttonVariants({ variant: "destructive" })}>Cancel</div>
                                {/* Cancel */}
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <div className=''>
                    <Table>
                        <TableCaption>A list of your recent todo.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {todo ? todo.map((el, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{el.title}</TableCell>
                                    <TableCell>{el.description}</TableCell>
                                    <TableCell>
                                        <Checkbox id="terms"
                                            checked={el.isChecked}
                                            onCheckedChange={(e) => updateTodo(el)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-x-4">
                                            <Button variant="outline" size="icon">
                                                <TbEdit size={20} />
                                            </Button>
                                            {JSON.stringify(el.id)}
                                            <Button variant="destructive" size="icon" onClick={() => toast.error('Are you sure?', {
                                                action: {
                                                    label: 'Confirm',
                                                    onClick: () => deleteTodo(el)
                                                },
                                            })}>
                                                <CiTrash size={20} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Loading...</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

            </main>
        </>
    )
}

export default Home