import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Task } from "../entities/Task";

@Resolver()
export class TaskResolver {
    @Query(() => String) //Query returning String of graphql
    hello(): string { //type string function that returns string
        return "hello world"
    }

    @Query(() => [Task])
    tasks(): Promise<Task[]> {
        return Task.find({})
    }

    @Query(() => Task, { nullable: true })
    task(
        @Arg("id", () => Int)
        id: number
    ): Promise<Task | undefined> {
        return Task.findOne({ id })
    }

    @Mutation(() => Task)
    createTask(
        @Arg("title", () => String)
        title: string
    ): Promise<Task> {
        return Task.create({ title, isComplete: false }).save()//We can use the create method as it was extends from BaseEntities
    }

    @Mutation(() => Boolean)
    deleteTask(
        @Arg("id", () => Int)
        id: number): boolean {
        try {
            Task.delete({ id })
            return true
        } catch (error) {
            console.log("🚀 ~ file: task.ts:39 ~ TaskResolver ~ error:", error)
            return false
        }
    }

    @Mutation(() => Boolean, { nullable: true })
    updateTask(
        @Arg("id", () => Int)
        id: number,
        @Arg("isComplete", () => Boolean)
        isComplete: boolean
    ): boolean | null {
        const task = Task.findOne({ id })
        if (!task) {
            return null
        }
        try {
            Task.update({ id }, { isComplete })
            return true
        } catch (err) {
            console.log("🚀 ~ file: task.ts:60 ~ TaskResolver ~ err:", err)
            return false
        }
    }
}
