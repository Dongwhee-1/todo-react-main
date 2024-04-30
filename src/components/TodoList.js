/* 
  할 일 목록을 관리하고 렌더링하는 주요 컴포넌트입니다.
  상태 관리를 위해 `useState` 훅을 사용하여 할 일 목록과 입력값을 관리합니다.
  할 일 목록의 추가, 삭제, 완료 상태 변경 등의 기능을 구현하였습니다.
*/
"use client";

import React, { useState, useEffect } from "react";
import TodoItem from "@/components/TodoItem";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GearIcon } from "@radix-ui/react-icons"

// firebase 관련 모듈을 불러옵니다.
import { db } from "@/firebase";
import {
  collection,
  query,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  where,
} from "firebase/firestore";

// DB의 todos 컬렉션 참조를 만듭니다. 컬렉션 사용시 잘못된 컬렉션 이름 사용을 방지합니다.
const todoCollection = collection(db, "todos");

// TodoList 컴포넌트를 정의합니다.
const TodoList = () => {
  // 상태를 관리하는 useState 훅을 사용하여 할 일 목록과 입력값을 초기화합니다.
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = () => {
    // Firestore 쿼리를 만듭니다. deadline을 기준으로 먼저 오름차순으로 정렬하고,
    // 동일한 deadline을 가진 할 일들 간에는 input을 기준으로 두 번째로 오름차순으로 정렬합니다.
    const q = query(todoCollection, orderBy("deadline"), orderBy("input"));
    
    // Firestore 에서 할 일 목록을 조회합니다.
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newTodos = [];
      
      // 가져온 할 일 목록을 newTodos 배열에 담습니다.
      querySnapshot.forEach((doc) => {
        newTodos.push({ id: doc.id, ...doc.data() });
      });
      
      // 정렬된 할 일 목록을 상태에 설정합니다.
      setTodos(newTodos); 
    });
  
    // unsubscribe 함수를 반환하여 컴포넌트가 언마운트될 때 리스너를 정리합니다.
    return unsubscribe;
  }
  
  // addTodo 함수는 입력값을 이용하여 새로운 할 일을 목록에 추가하는 함수입니다.
  const addTodo = async () => {
    // 입력값이 비어있는 경우 함수를 종료합니다.
    if (input.trim() === "") return;
    const docRef = await addDoc(todoCollection, {
      text: deadline + " : " + input,
      completed: false,
    })
    // const newTodo = {
    //   id: Date.now(),
    //   text: input,
    //   completed: false,
    //   deadline: deadline, // 선택한 완료 기한을 할일 객체에 추가
    // };
    // 기존 할 일 목록에 새로운 할 일을 추가하고, 입력값을 초기화합니다.
    // {
    //   id: 할일의 고유 id,
    //   text: 할일의 내용,
    //   completed: 완료 여부,
    // }
    // ...todos => {id: 1, text: "할일1", completed: false}, {id: 2, text: "할일2", completed: false}}, ..
    setTodos([...todos, { id: docRef.id, text: deadline + " : " + input, completed: false }]);
    setInput("");
  };

  // toggleTodo 함수는 체크박스를 눌러 할 일의 완료 상태를 변경하는 함수입니다.
  const toggleTodo = (id) => {
    // 할 일 목록에서 해당 id를 가진 할 일의 완료 상태를 반전시킵니다.
    setTodos(
      // todos.map((todo) =>
      //   todo.id === id ? { ...todo, completed: !todo.completed } : todo
      // )
      // ...todo => id: 1, text: "할일1", completed: false
      todos.map((todo) => {
        if (todo.id === id) {
          // Firestore 에서 해당 id를 가진 할 일을 찾아 완료 상태를 업데이트합니다.
          const todoDoc = doc(todoCollection, id);
          updateDoc(todoDoc, { completed: !todo.completed });
          // ...todo => id: 1, text: "할일1", completed: false
          return { ...todo, completed: !todo.completed };
        } else {
          return todo;
        }
      })
    );
  };

  // deleteTodo 함수는 할 일을 목록에서 삭제하는 함수입니다.
  const deleteTodo = (id) => {
    // Firestore 에서 해당 id를 가진 할 일을 삭제합니다.
    const todoDoc = doc(todoCollection, id);
    deleteDoc(todoDoc);

    // 해당 id를 가진 할 일을 제외한 나머지 목록을 새로운 상태로 저장합니다.
    // setTodos(todos.filter((todo) => todo.id !== id));
    setTodos(
      todos.filter((todo) => {
        return todo.id !== id;
      })
    );
  };

  // 컴포넌트를 렌더링합니다.
  return (
    <div className="container max-w-600px mx-auto mt-10 px-10 py-10 bg-slate-900 text-green-500 rounded-lg shadow-md">
      <h1 className="text-2xl">Todo List of 'The One'</h1>
      <br/>
      {/* 할 일을 입력받는 텍스트 필드입니다. */}
      <Input
        type="text"
        className="w-full py-5 px-5 mb-6 border-green-500 bg-gray-800 text-green-500"
        placeholder="Wake up, Neo..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Input
        className="w-100 text-green-500 hover:text-yellow-500 bg-gray-800 hover:bg-white border-2 border-green-500 hover:border-yellow-500 rounded"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <br />
      {/* 할 일을 추가하는 버튼입니다. */}
      <Button className="py-2 px-2 bg-gray-800 hover:bg-white text-green-500 hover:text-yellow-500 border-2 border-green-500 hover:border-yellow-500 rounded cursor-pointer" onClick={addTodo}>
        <GearIcon className="mr-2 h-4 w-4 animate-spin duration-50"/>Add Todo
      </Button>
      {/* 할 일 목록을 렌더링합니다. */}
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;


