import { describe, expect, it } from "vitest"
import { createTask, openCount, renameTask, visibleTasks, seedTasks } from "./tasks"

// Два теста, с которыми поставляется стартер. Они проходят и не покрывают
// поведение, описанное в ISSUE-7.md.
describe("базовая доска", () => {
    it("создаёт задачу и обрезает название", () => {
        const task = createTask(9, "  Купить хлеб  ")
        expect(task?.title).toBe("Купить хлеб")
    })

    it("фильтрует готовые задачи", () => {
        expect(visibleTasks(seedTasks, "done").map((task) => task.id)).toEqual([2])
    })
})

describe("пустые названия", () => {
    it.each(["   ", "\t", "\u00A0"])(
        "не переименовывает задачу в пустое название (%j)",
        (title) => {
            const tasks = [{ id: 1, title: "Исходное название", done: false }]

            expect(renameTask(tasks, 1, title)).toEqual(tasks)
        },
    )

    it("обрезает пробелы по краям при переименовании", () => {
        const tasks = [{ id: 1, title: "Старое название", done: false }]

        expect(renameTask(tasks, 1, "  Новое название  ")[0].title).toBe("Новое название")
    })

    it("не показывает пустую задачу, уже сохранённую на доске", () => {
        expect(visibleTasks(seedTasks, "all").map((task) => task.id)).toEqual([1, 2])
    })

    it("не считает пустую задачу открытой", () => {
        expect(openCount(seedTasks)).toBe(1)
    })
})
