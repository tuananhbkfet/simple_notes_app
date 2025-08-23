import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

export function NotesApp() {
  const [filterType, setFilterType] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [filterGroup, setFilterGroup] = useState<string | undefined>(undefined);
  const groups = useQuery(api.notes.listGroups) || [];
  const notes = useQuery(api.notes.list, { 
    filter: filterType === 'all' ? undefined : filterType, 
    group: filterGroup 
  }) || [];
  const createNote = useMutation(api.notes.create);
  const updateNote = useMutation(api.notes.update);
  const deleteNote = useMutation(api.notes.remove);
  const toggleCompleted = useMutation(api.notes.toggleCompleted);
  
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteGroup, setNewNoteGroup] = useState<string>("");
  const [editingId, setEditingId] = useState<Id<"notes"> | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editGroup, setEditGroup] = useState<string>("");
  const [sortType, setSortType] = useState<'newest' | 'oldest' | 'alphabetical' | 'reverseAlphabetical'>('newest');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [customGroup, setCustomGroup] = useState<string>("");
  const [showCustomGroupInput, setShowCustomGroupInput] = useState(false);
  const [customGroups, setCustomGroups] = useState<string[]>([]);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  
  // Danh sách nhóm từ database và các nhóm đã thêm trong phiên làm việc hiện tại
  const availableGroups: string[] = [...new Set([...(groups as string[] || []), ...customGroups])].sort();

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteContent.trim() === "") return;
    
    const finalGroup = showCustomGroupInput ? customGroup : newNoteGroup;
    
    try {
      await createNote({ content: newNoteContent, group: finalGroup });
      setNewNoteContent("");
      setNewNoteGroup("");
      setCustomGroup("");
      setShowCustomGroupInput(false);
      toast.success("Đã tạo ghi chú mới");
    } catch (error) {
      toast.error("Không thể tạo ghi chú");
    }
  };

  const handleEditNote = (noteId: Id<"notes">, content: string, group?: string) => {
    setEditingId(noteId);
    setEditContent(content);
    setEditGroup(group || "");
    setShowCustomGroupInput(false);
  };

  const handleSaveEdit = async () => {
    if (!editingId || editContent.trim() === "") return;
    
    const finalGroup = showCustomGroupInput ? customGroup : editGroup;
    
    try {
      await updateNote({ id: editingId, content: editContent, group: finalGroup });
      setEditingId(null);
      setEditContent("");
      setEditGroup("");
      setCustomGroup("");
      setShowCustomGroupInput(false);
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
  
  const handleToggleCompleted = async (noteId: Id<"notes">) => {
    try {
      const newStatus = await toggleCompleted({ id: noteId });
      toast.success(newStatus ? "Đã đánh dấu hoàn thành" : "Đã bỏ đánh dấu hoàn thành");
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái ghi chú");
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
  
  const getSortedNotes = () => {
    if (sortType === 'newest') {
      return [...notes].sort((a, b) => b._creationTime - a._creationTime);
    } else if (sortType === 'oldest') {
      return [...notes].sort((a, b) => a._creationTime - b._creationTime);
    } else if (sortType === 'alphabetical') {
      return [...notes].sort((a, b) => a.content.localeCompare(b.content, 'vi'));
    } else if (sortType === 'reverseAlphabetical') {
      return [...notes].sort((a, b) => b.content.localeCompare(a.content, 'vi'));
    }
    return notes;
  };

  // Theo dõi sự kiện cuộn và hiển thị nút khi cuộn xuống dưới
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Hàm di chuyển lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Xử lý thêm nhóm mới khi tạo ghi chú
  const handleAddNewGroup = () => {
    if (customGroup.trim() !== "") {
      const newGroupName = customGroup.trim();
      setNewNoteGroup(newGroupName);
      setCustomGroups(prev => {
        if (!prev.includes(newGroupName)) {
          return [...prev, newGroupName];
        }
        return prev;
      });
      setShowCustomGroupInput(false);
      setCustomGroup("");
      toast.success(`Đã thêm nhóm "${newGroupName}"`);
    } else {
      toast.error("Tên nhóm không được để trống");
    }
  };
  
  // Xử lý thêm nhóm mới khi chỉnh sửa ghi chú
  const handleAddNewGroupInEdit = () => {
    if (customGroup.trim() !== "") {
      const newGroupName = customGroup.trim();
      setEditGroup(newGroupName);
      setCustomGroups(prev => {
        if (!prev.includes(newGroupName)) {
          return [...prev, newGroupName];
        }
        return prev;
      });
      setShowCustomGroupInput(false);
      setCustomGroup("");
      toast.success(`Đã thêm nhóm "${newGroupName}"`);
    } else {
      toast.error("Tên nhóm không được để trống");
    }
  };
  
  // Mở modal để chỉnh sửa tên nhóm
  const handleEditGroupName = (groupName: string) => {
    setEditingGroup(groupName);
    setNewGroupName(groupName);
    setShowEditGroupModal(true);
  };
  
  // Lưu tên nhóm mới
  const renameGroupMutation = useMutation(api.notes.renameGroup);
  
  const handleSaveGroupName = async () => {
    if (!editingGroup || newGroupName.trim() === "") {
      toast.error("Tên nhóm không được để trống");
      return;
    }
    
    if (editingGroup === newGroupName) {
      setShowEditGroupModal(false);
      setEditingGroup(null);
      return;
    }
    
    try {
      const updatedCount = await renameGroupMutation({
        oldGroupName: editingGroup,
        newGroupName: newGroupName.trim()
      });
      
      // Cập nhật danh sách nhóm tùy chỉnh nếu đang chỉnh sửa một nhóm tùy chỉnh
      setCustomGroups(prev => {
        const newGroups = prev.filter(g => g !== editingGroup);
        if (!newGroups.includes(newGroupName) && !groups.includes(newGroupName)) {
          newGroups.push(newGroupName);
        }
        return newGroups;
      });
      
      // Nếu đang chỉnh sửa ghi chú và ghi chú đó thuộc nhóm đang được đổi tên
      if (editGroup === editingGroup) {
        setEditGroup(newGroupName);
      }
      
      // Nếu đang chọn nhóm cho ghi chú mới và nhóm đó đang được đổi tên
      if (newNoteGroup === editingGroup) {
        setNewNoteGroup(newGroupName);
      }
      
      // Nếu đang lọc theo nhóm và nhóm đó đang được đổi tên
      if (filterGroup === editingGroup) {
        setFilterGroup(newGroupName);
      }
      
      setShowEditGroupModal(false);
      setEditingGroup(null);
      toast.success(`Đã đổi tên nhóm thành "${newGroupName}" (${updatedCount} ghi chú được cập nhật)`);
    } catch (error) {
      toast.error("Không thể đổi tên nhóm");
    }
  };
  
  // Hàm xuất dữ liệu notes ra file CSV
  const exportNotesData = () => {
    // Nếu không có ghi chú nào
    if (notes.length === 0) {
      toast.error("Không có dữ liệu để xuất");
      return;
    }
    
    // Header cho file CSV
    const csvHeader = "STT,Nội dung,Trạng thái,Nhóm,Thời gian tạo\n";
    
    // Chuyển đổi dữ liệu notes thành định dạng CSV
    const csvData = getSortedNotes().map((note, index) => {
      // Thay thế dấu phẩy trong nội dung để tránh xung đột với CSV
      const content = note.content.replace(/,/g, ";").replace(/\n/g, " ");
      const status = note.completed ? "Đã hoàn thành" : "Chưa hoàn thành";
      const group = note.group ? note.group : "Không có nhóm";
      const creationTime = formatDate(note._creationTime);
      return `${index + 1},"${content}","${status}","${group}","${creationTime}"`;
    }).join("\n");
    
    // Thêm BOM (Byte Order Mark) để đảm bảo Excel hiển thị đúng tiếng Việt
    const BOM = '\uFEFF';
    
    // Tạo Blob từ dữ liệu CSV với BOM ở đầu
    const blob = new Blob([BOM + csvHeader + csvData], { type: "text/csv;charset=utf-8-sig" });
    
    // Tạo URL tạm thời cho Blob
    const url = URL.createObjectURL(blob);
    
    // Tạo phần tử a để tải file
    const link = document.createElement("a");
    link.href = url;
    link.download = `notes_export_${new Date().toLocaleDateString().replace(/\//g, "-")}.csv`;
    
    // Thêm link vào DOM, kích hoạt click và xóa
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Giải phóng URL tạm thời
    URL.revokeObjectURL(url);
    
    toast.success("Đã xuất dữ liệu thành công");
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
          
          {/* Chọn nhóm cho ghi chú mới */}
          <div className="flex flex-wrap gap-2">
            {showCustomGroupInput ? (
              <div className="flex items-center gap-2 w-full">
                <input 
                  type="text"
                  value={customGroup}
                  onChange={(e) => setCustomGroup(e.target.value)}
                  placeholder="Nhập tên nhóm mới"
                  className="flex-grow p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button 
                  type="button"
                  onClick={handleAddNewGroup}
                  disabled={customGroup.trim() === ""}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Thêm
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowCustomGroupInput(false);
                    setCustomGroup("");
                  }}
                  className="px-3 py-1.5 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <label htmlFor="group-select" className="text-sm font-medium text-gray-600">
                    Nhóm:
                  </label>
                  <div className="flex items-center">
                    <select
                      id="group-select"
                      value={newNoteGroup}
                      onChange={(e) => setNewNoteGroup(e.target.value)}
                      className="bg-white border border-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Không có nhóm</option>
                      {availableGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                    {newNoteGroup && (
                      <button 
                        type="button"
                        onClick={() => handleEditGroupName(newNoteGroup)}
                        className="ml-2 p-1 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                        title="Sửa tên nhóm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomGroupInput(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tạo nhóm mới
                </button>
              </>
            )}
          </div>
          
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

      {/* Sort and Filter Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="filter-select" className="text-sm font-medium text-gray-600">
              Trạng thái:
            </label>
            <select
              id="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'completed' | 'incomplete')}
              className="bg-white border border-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="incomplete">Chưa hoàn thành</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="group-filter-select" className="text-sm font-medium text-gray-600">
              Nhóm:
            </label>
            <div className="flex items-center space-x-2">
              <select
                id="group-filter-select"
                value={filterGroup || ""}
                onChange={(e) => setFilterGroup(e.target.value === "" ? undefined : e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="no_group">Không có nhóm</option>
                {availableGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
              {filterGroup && filterGroup !== "no_group" && (
                <button 
                  type="button"
                  onClick={() => handleEditGroupName(filterGroup)}
                  className="p-1 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                  title="Sửa tên nhóm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="sort-select" className="text-sm font-medium text-gray-600">
              Sắp xếp:
            </label>
            <select
              id="sort-select"
              value={sortType}
              onChange={(e) => setSortType(e.target.value as 'newest' | 'oldest' | 'alphabetical' | 'reverseAlphabetical')}
              className="bg-white border border-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="alphabetical">Từ A-Z</option>
              <option value="reverseAlphabetical">Từ Z-A</option>
            </select>
          </div>
        </div>
        <button
          onClick={exportNotesData}
          className="flex items-center space-x-1 px-4 py-1.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow"
          disabled={notes.length === 0}
          title={notes.length === 0 ? "Không có dữ liệu để xuất" : "Xuất dữ liệu"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Xuất dữ liệu</span>
        </button>
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
          getSortedNotes().map((note) => (
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
                  
                  {/* Chọn nhóm khi sửa note */}
                  <div className="flex flex-wrap gap-2">
                    {showCustomGroupInput ? (
                      <div className="flex items-center gap-2 w-full">
                        <input 
                          type="text"
                          value={customGroup}
                          onChange={(e) => setCustomGroup(e.target.value)}
                          placeholder="Nhập tên nhóm mới"
                          className="flex-grow p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <button 
                          type="button"
                          onClick={handleAddNewGroupInEdit}
                          disabled={customGroup.trim() === ""}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Thêm
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setShowCustomGroupInput(false);
                            setCustomGroup("");
                          }}
                          className="px-3 py-1.5 text-gray-600 hover:text-gray-800"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <label htmlFor="edit-group-select" className="text-sm font-medium text-gray-600">
                            Nhóm:
                          </label>
                          <div className="flex items-center">
                            <select
                              id="edit-group-select"
                              value={editGroup}
                              onChange={(e) => setEditGroup(e.target.value)}
                              className="bg-white border border-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Không có nhóm</option>
                              {availableGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                              ))}
                            </select>
                            {editGroup && (
                              <button 
                                type="button"
                                onClick={() => handleEditGroupName(editGroup)}
                                className="ml-2 p-1 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                                title="Sửa tên nhóm"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowCustomGroupInput(true)}
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Tạo nhóm mới
                        </button>
                      </>
                    )}
                  </div>
                  
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
                  <div className="flex items-start mb-4">
                    <button
                      onClick={() => handleToggleCompleted(note._id)}
                      className={`flex-shrink-0 mr-3 h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        note.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                      title={note.completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
                    >
                      {note.completed && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">
                      {note.content}
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-gray-400 italic">{formatDate(note._creationTime)}</span>
                      {note.completed && (
                        <span className="text-green-500 font-medium">Đã hoàn thành</span>
                      )}
                      {note.group && note.group.trim() !== "" && (
                        <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          {note.group}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleEditNote(note._id, note.content, note.group)}
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

      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none"
          aria-label="Lên đầu trang"
          title="Lên đầu trang"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      
      {/* Modal đổi tên nhóm */}
      {showEditGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Đổi tên nhóm</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tên nhóm hiện tại:
                </label>
                <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                  {editingGroup}
                </div>
              </div>
              
              <div>
                <label htmlFor="new-group-name" className="block text-sm font-medium text-gray-600 mb-1">
                  Tên nhóm mới:
                </label>
                <input
                  id="new-group-name"
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập tên nhóm mới"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditGroupModal(false);
                  setEditingGroup(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveGroupName}
                disabled={!newGroupName.trim() || newGroupName === editingGroup}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
