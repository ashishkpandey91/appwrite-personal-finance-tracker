import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
} from "@/features/todoSlice";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Checkbox } from "./ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { Todo } from "@/types/finance";
import { TodoListSkeleton } from "./skeletons/TodoSkeleton";

interface TodoListProps {
  isLoading?: boolean;
}

export const TodoList = ({ isLoading = false }: TodoListProps) => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todo?.entities || []);
  const createStatus = useAppSelector((state) => state.todo?.createStatus);
  const updateStatus = useAppSelector((state) => state.todo?.updateStatus);

  const [showAddTodo, setShowAddTodo] = useState(false);
  const [showEditTodo, setShowEditTodo] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [clearCompletedDialogOpen, setClearCompletedDialogOpen] = useState(false);

  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    completed: false,
  });

  const [editTodoForm, setEditTodoForm] = useState({
    title: "",
    description: "",
    completed: false,
  });

  const handleAddTodo = async () => {
    if (!newTodo.title.trim()) {
      alert("Please enter a title");
      return;
    }

    try {
      await dispatch(createTodo(newTodo));
      setNewTodo({ title: "", description: "", completed: false });
      setShowAddTodo(false);
    } catch (error) {
      alert("Failed to create todo");
    }
  };

  const handleEditTodo = async () => {
    if (!editTodoForm.title.trim() || !editingTodo) {
      alert("Please enter a title");
      return;
    }

    try {
      await dispatch(
        updateTodo({
          id: editingTodo.id,
          updates: editTodoForm,
        })
      );
      setEditTodoForm({ title: "", description: "", completed: false });
      setEditingTodo(null);
      setShowEditTodo(false);
    } catch (error) {
      alert("Failed to update todo");
    }
  };

  const handleDeleteTodo = async () => {
    if (!todoToDelete) return;

    try {
      await dispatch(deleteTodo(todoToDelete));
      setDeleteDialogOpen(false);
      setTodoToDelete(null);
    } catch (error) {
      alert("Failed to delete todo");
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await dispatch(toggleTodoComplete({ id, completed: !completed }));
    } catch (error) {
      alert("Failed to update todo");
    }
  };

  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo);
    setEditTodoForm({
      title: todo.title,
      description: todo.description || "",
      completed: todo.completed,
    });
    setShowEditTodo(true);
  };

  const openDeleteDialog = (id: string) => {
    setTodoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    try {
      await Promise.all(
        completedTodos.map((todo) => dispatch(deleteTodo(todo.id)))
      );
      setClearCompletedDialogOpen(false);
    } catch (error) {
      alert("Failed to clear completed todos");
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  if (isLoading) {
    return <TodoListSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-2xl font-bold">My Todos</h2>
        <div className="flex gap-2">
          {completedCount > 0 && (
            <Button
              onClick={() => setClearCompletedDialogOpen(true)}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Completed ({completedCount})
            </Button>
          )}
          <Button
            onClick={() => setShowAddTodo(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Todo
          </Button>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-12 w-full flex flex-col items-center justify-center">
            <p className="text-gray-500 mb-4">
              No todos yet. Create one to get started!
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="647.63626"
              height="632.17383"
              viewBox="0 0 647.63626 632.17383"
              role="img"
              className="h-28 w-28"
            >
              <path
                d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z"
                transform="translate(-276.18187 -133.91309)"
                fill="#f2f2f2"
              />
              <path
                d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z"
                transform="translate(-276.18187 -133.91309)"
                fill="#3f3d56"
              />
              <path
                d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z"
                transform="translate(-276.18187 -133.91309)"
                fill="#345FEB"
              />
              <circle cx="190.15351" cy="24.95465" r="20" fill="#345FEB" />
              <circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff" />
              <path
                d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z"
                transform="translate(-276.18187 -133.91309)"
                fill="#e6e6e6"
              />
              <path
                d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z"
                transform="translate(-276.18187 -133.91309)"
                fill="#3f3d56"
              />
              <path
                d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z"
                transform="translate(-276.18187 -133.91309)"
                fill="#345FEB"
              />
              <circle cx="433.63626" cy="105.17383" r="20" fill="#345FEB" />
              <circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff" />
            </svg>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white rounded-lg shadow-sm border p-4 transition-all ${
                todo.completed ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() =>
                    handleToggleComplete(todo.id, todo.completed)
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p
                      className={`text-sm mt-1 ${
                        todo.completed ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {todo.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(todo)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(todo.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Todo Sheet */}
      <Sheet open={showAddTodo} onOpenChange={setShowAddTodo}>
        <SheetContent
          className="w-full sm:w-[540px] p-0 overflow-y-auto mobile-sheet"
          side="bottom"
        >
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
            <div className="flex items-center h-14 px-4">
              <button
                onClick={() => setShowAddTodo(false)}
                className="mr-3 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <svg
                  className="h-5 w-5 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Todo
                </h2>
                <p className="text-xs text-gray-500">Create a new task</p>
              </div>
            </div>
          </div>

          <div className="px-4 pb-24 pt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Enter todo title"
                  value={newTodo.title}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, title: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Description (Optional)
                </label>
                <Textarea
                  placeholder="Enter description"
                  value={newTodo.description}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddTodo(false)}
                  className="flex-1"
                  disabled={createStatus === "pending"}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddTodo}
                  className="flex-1"
                  disabled={createStatus === "pending"}
                >
                  {createStatus === "pending" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Todo Sheet */}
      <Sheet open={showEditTodo} onOpenChange={setShowEditTodo}>
        <SheetContent
          className="w-full sm:w-[540px] p-0 overflow-y-auto mobile-sheet"
          side="bottom"
        >
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
            <div className="flex items-center h-14 px-4">
              <button
                onClick={() => setShowEditTodo(false)}
                className="mr-3 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <svg
                  className="h-5 w-5 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Todo
                </h2>
                <p className="text-xs text-gray-500">Update your task</p>
              </div>
            </div>
          </div>

          <div className="px-4 pb-24 pt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Enter todo title"
                  value={editTodoForm.title}
                  onChange={(e) =>
                    setEditTodoForm({ ...editTodoForm, title: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Description (Optional)
                </label>
                <Textarea
                  placeholder="Enter description"
                  value={editTodoForm.description}
                  onChange={(e) =>
                    setEditTodoForm({
                      ...editTodoForm,
                      description: e.target.value,
                    })
                  }
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditTodo(false)}
                  className="flex-1"
                  disabled={updateStatus === "pending"}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditTodo}
                  className="flex-1"
                  disabled={updateStatus === "pending"}
                >
                  {updateStatus === "pending" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this todo? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTodo}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Completed Confirmation Dialog */}
      <AlertDialog
        open={clearCompletedDialogOpen}
        onOpenChange={setClearCompletedDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Completed Todos</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all {completedCount} completed
              todo(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCompleted}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
