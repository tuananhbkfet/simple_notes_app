import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

export function NotesApp() {
  const notes = useQuery(api.notes.list) || [];
  const createNote = useMutation(api.notes.create);
  const updateNote = useMutation(api.notes.update);
  const deleteNote = useMutation(api.notes.remove);
  
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingId, setEditingId] = useState<Id<"notes"> | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteContent.trim() === "") return;
    
    try {
      await createNote({ content: newNoteContent });
      setNewNoteContent("");
      toast.success("Đã tạo ghi chú mới");
    } catch (error) {
      toast.error("Không thể tạo ghi chú");
    }
  };

  const handleEditNote = (noteId: Id<"notes">, content: string) => {
    setEditingId(noteId);
    setEditContent(content);
  };

  const handleSaveEdit = async () => {
    if (!editingId || editContent.trim() === "") return;
    
    try {
      await updateNote({ id: editingId, content: editContent });
      setEditingId(null);
      setEditContent("");
      toast.success("Đã cập nhật ghi chú");
    } catch (error) {
      toast.error("Không thể cập nhật ghi chú");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleDeleteNote = async (noteId: Id<"notes">) => {
    try {
      await deleteNote({ id: noteId });
      toast.success("Đã xóa ghi chú");
    } catch (error) {
      toast.error("Không thể xóa ghi chú");
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) + " " + date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Create Note Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
        <form onSubmit={handleCreateNote} className="space-y-4">
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Bạn đang nghĩ gì?"
            className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={newNoteContent.trim() === ""}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
            >
              Ghi chú
            </button>
          </div>
        </form>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-300 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Chưa có ghi chú nào</h3>
            <p className="text-gray-500">Tạo ghi chú đầu tiên của bạn ở trên</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5"
            >
              {editingId === note._id ? (
                <div className="space-y-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-800"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={editContent.trim() === ""}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base mb-4">
                    {note.content}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400 italic">
                      {formatDate(note._creationTime)}
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleEditNote(note._id, note.content)}
                        className="text-gray-400 hover:text-blue-500 transition-colors duration-200 p-1.5 rounded-lg hover:bg-blue-50"
                        title="Chỉnh sửa"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1.5 rounded-lg hover:bg-red-50"
                        title="Xóa"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
