import * as Checkbox from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

interface HabitsListProps {
  date: Date;
  onCompletedChanged: (completed: number) => void;
}

interface HabitsInfo {
  possibleHabits: Array<{
    id: string;
    title: string;
    created_at: string;
  }>;
  completedHabits: string[];
}

// passamos pra ca, pois esse componente não existe em tela antes, e o useEffect só executa quando abrimos lá no popover. Se passarmos o useEffect no nosso HabitDay lá, ele vai executar toda vez que o HabitDay for renderizado, que são até agora 21 vezes no dia de hoje
export function HabitsList({ date, onCompletedChanged }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  useEffect(() => {
    api
      .get("day", {
        params: {
          date: date.toISOString(),
        },
      })
      .then((response) => {
        setHabitsInfo(response.data);
      });
  }, []);

  async function handleToggleHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`)

    const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId);

    let completedHabits: string[] = []

    if (isHabitAlreadyCompleted) {
      // remover da lista
      completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)

      setHabitsInfo({
        possibleHabits: habitsInfo!.possibleHabits,
        completedHabits,
      })
    }else {
      // adicionar na lista
      completedHabits = [...habitsInfo!.completedHabits, habitId]
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    })

    onCompletedChanged(completedHabits.length)

  }

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map((habit) => (
        <Checkbox.Root
          key={habit.id}
          onCheckedChange={() => handleToggleHabit(habit.id)}
          className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
          checked={habitsInfo.completedHabits.includes(habit.id)}
          disabled={isDateInPast}
        >
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors duration-150 group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
            <Checkbox.Indicator>
              <Check size={20} className="text-white" />
            </Checkbox.Indicator>
          </div>

          <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400 transition-all duration-150">
            {habit.title}
          </span>
        </Checkbox.Root>
      ))}
    </div>
  );
}
