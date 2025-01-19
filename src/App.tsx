import React, { useEffect, useState } from 'react';
import './App.css';

type ColorBox = {
  id: number;
  color: string | null;
};

function shuffleArray(array: string[]) {
  const shuffled = [...array]; // Создаем копию массива
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1)); // Случайный индекс
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]]; // Обмен элементов
  }
  return shuffled;
}

const initData = ['blue', 'yellow', 'green', 'red', 'purple', 'orange'];

export const ExampleGame = () => {
  const [draggedBox, setDraggedBox] = useState<ColorBox | null>(null);
  const [dragSource, setDragSource] = useState<'source' | 'choosed' | null>(
    null
  );

  const [answers, setAnswers] = useState<string[]>([]);

  const [sourceBoxes, setSourceBoxes] = useState<ColorBox[]>([
    { id: 1, color: 'red' },
    { id: 2, color: 'yellow' },
    { id: 3, color: 'green' },
    { id: 4, color: 'blue' },
    { id: 5, color: 'purple' },
    { id: 6, color: 'orange' },
  ]);

  useEffect(() => {
    setAnswers([...shuffleArray(initData)]);
  }, []);

  const [choosedColors, setChoosedColors] = useState<ColorBox[]>(
    Array(6)
      .fill(null)
      .map((_, idx) => ({ id: idx + 1, color: null }))
  );

  const handleOnDrag = (box: ColorBox, source: 'source' | 'choosed') => {
    setDraggedBox(box);
    setDragSource(source);
  };

  const handleOnDropToChoosedColors = (droppedIdx: number) => {
    if (!draggedBox) return;

    if (dragSource === 'source') {
      if (choosedColors[droppedIdx].color === null) {
        setSourceBoxes((prevState) => {
          if (
            prevState.find((box) => box.id === draggedBox.id)?.color === null
          ) {
            return prevState; // Если цвет уже null, не обновляем
          }
          return prevState.map((box) =>
            box.id === draggedBox.id ? { ...box, color: null } : box
          );
        });

        setChoosedColors((prevState) => {
          if (prevState[droppedIdx].color === draggedBox.color) {
            return prevState; // Если цвет не меняется, не обновляем
          }
          return prevState.map((box, idx) =>
            idx === droppedIdx ? { ...box, color: draggedBox.color } : box
          );
        });
      } else {
        // Обмен цветов между draggedBox и занятой ячейкой
        setSourceBoxes((prevState) => {
          return prevState.map((box) =>
            box.id === draggedBox.id
              ? { ...box, color: choosedColors[droppedIdx].color }
              : box
          );
        });

        setChoosedColors((prevState) => {
          return prevState.map((box, idx) =>
            idx === droppedIdx ? { ...box, color: draggedBox.color } : box
          );
        });
      }
    } else if (dragSource === 'choosed') {
      setChoosedColors((prevState) => {
        const updatedState = [...prevState];
        const draggedIdx = updatedState.findIndex(
          (box) => box.id === draggedBox.id
        );

        if (draggedIdx === -1) {
          return prevState; // Если элемент не найден, ничего не делаем
        }

        if (choosedColors[droppedIdx].color === null) {
          updatedState[draggedIdx].color = null;
          updatedState[droppedIdx].color = draggedBox.color;
        } else {
          const draggedColor = draggedBox.color;

          const droppedColor = updatedState[droppedIdx].color;

          updatedState[draggedIdx].color = droppedColor;
          updatedState[droppedIdx].color = draggedColor;
        }

        return updatedState;
      });
    }

    setDraggedBox(null);
    setDragSource(null);
  };

  const handleOnDropToSourceColors = (droppedIdx: number) => {
    if (!draggedBox || dragSource !== 'choosed') return;

    if (sourceBoxes[droppedIdx].color === null) {
      setChoosedColors((prevState) => {
        return prevState.map((box) =>
          box.id === draggedBox.id ? { ...box, color: null } : box
        );
      });

      setSourceBoxes((prevState) => {
        return prevState.map((box, idx) =>
          idx === droppedIdx ? { ...box, color: draggedBox.color } : box
        );
      });
    }else {
      setChoosedColors((prevState) => {
        return prevState.map((box) =>
          box.id === draggedBox.id ? { ...box, color: sourceBoxes[droppedIdx].color } : box
        );
      });

      setSourceBoxes((prevState) => {
        return prevState.map((box, idx) =>
          idx === droppedIdx ? { ...box, color: draggedBox.color } : box
        );
      });
    }
    setDraggedBox(null);
    setDragSource(null);
  };

  return (
    <div className="flex flex-col items-center mt-[100px]">
      <p className="max-w-[400px] text-center mb-5 text-2xl">
        {' '}
        Количество правильных ответов:{' '}
        {choosedColors.reduce((acc, el, idx) => {
          if (answers[idx] === el.color) {
            return acc + 1;
          }
          return acc;
        }, 0)}
      </p>
      <ul className="flex flex-wrap justify-center gap-5 mb-5 max-w-[1000px] mx-auto border-b-2 pb-5 border-white">
        {sourceBoxes.map(({ color, id }, idx) => (
          <li
            key={id}
            onDragOver={(e) => e.preventDefault()}
            onDragStart={() => handleOnDrag({ color, id }, 'source')}
            onDrop={() => handleOnDropToSourceColors(idx)}
            draggable={color !== null}
            className="h-[110px] w-[110px] border-2 border-[#555353] flex flex-col items-center justify-center relative"
          >
            <div
              style={{ backgroundColor: color || 'gray' }}
              className="h-[75px] w-[75px] rounded-full"
            ></div>
            <p className='absolute bottom-0 right-1'>
              {idx+1}
            </p>
          </li>
          
        ))}
      </ul>
      <ul className="flex justify-center gap-5 flex-wrap max-w-[1000px] mx-auto">
        {choosedColors.map(({ color, id }, idx) => (
          <li
            key={id}
            onDragOver={(e) => e.preventDefault()}
            onDragStart={() => handleOnDrag({ color, id }, 'choosed')}
            onDrop={() => handleOnDropToChoosedColors(idx)}
            draggable={color !== null}
            className="h-[100px] w-[110px] border-2 border-[#555353] flex flex-col items-center justify-center relative" 
          >
            <div
              style={{ backgroundColor: color || 'gray' }}
              className="h-[75px] w-[75px] rounded-full"
            ></div>
            <p className='absolute bottom-0 right-1'>
              {idx+1}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExampleGame;
