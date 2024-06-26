import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTodo,
  addTodo,
  checkboxTodo,
  deleteTodo,
  updateTodo,
} from "../store/reducers/todoReducer";
import { TodoLists } from "../interface";

export default function TodoList() {
  const [todoName, setTodoName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [todoToDelete, setTodoToDelete] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [todoToEdit, setTodoToEdit] = useState<number | null>(null);
  const getData: TodoLists[] = useSelector((state: any) => state.todo.todo);
  const dispatch = useDispatch();

  // hiện thị công việc
  useEffect(() => {
    dispatch(getTodo());
  }, [dispatch]);

  // thêm và cập nhật công việc
  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!todoName.trim()) {
      setError("Tên công việc không được để trống.");
      setShowErrorModal(true);
      return;
    }
    if (
      getData.some((todo) => todo.name === todoName && todo.id !== todoToEdit)
    ) {
      setError("Tên công việc không được phép trùng.");
      setShowErrorModal(true);
      return;
    }
    setError("");
    setShowErrorModal(false);
    if (isEditing && todoToEdit !== null) {
      dispatch(updateTodo({ id: todoToEdit, name: todoName }));
      setIsEditing(false);
      setTodoToEdit(null);
    } else {
      dispatch(addTodo({ name: todoName, status: false }));
    }
    setTodoName("");
  };

  // ẩn modal lỗi
  const closeModal = () => {
    setShowErrorModal(false);
    setTodoName("");
  };

  // checkbox công việc
  const handleCheckboxChange = (id: number) => {
    dispatch(checkboxTodo(id));
  };

  // hiện modal xóa
  const handleDeleteClick = (id: number) => {
    setTodoToDelete(id);
    setShowDeleteModal(true);
  };

  // hành động xóa công việc
  const handleDeleteConfirm = () => {
    if (todoToDelete !== null) {
      dispatch(deleteTodo(todoToDelete));
      setShowDeleteModal(false);
      setTodoToDelete(null);
    }
  };

  // ẩn modal xóa
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setTodoToDelete(null);
  };

  // xử lý cập nhật
  const handleEditClick = (id: number, name: string) => {
    setTodoName(name);
    setIsEditing(true);
    setTodoToEdit(id);
  };

  return (
    <>
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card">
                <div className="card-body p-5">
                  <form
                    className="d-flex justify-content-center align-items-center mb-4"
                    onSubmit={handleAddTodo}
                  >
                    <div className="form-outline flex-fill">
                      <input
                        type="text"
                        id="form2"
                        className="form-control"
                        value={todoName}
                        onChange={(e) => setTodoName(e.target.value)}
                      />
                      <label className="form-label" htmlFor="form2">
                        Nhập tên công việc
                      </label>
                    </div>
                    <button type="submit" className="btn btn-info ms-2">
                      {isEditing ? "Cập nhật" : "Thêm"}
                    </button>
                  </form>
                  {/* Tabs navs */}
                  <ul className="nav nav-tabs mb-4 pb-2">
                    <li className="nav-item" role="presentation">
                      <a className="nav-link active">Tất cả</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link">Đã hoàn thành</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link">Chưa hoàn thành</a>
                    </li>
                  </ul>
                  {/* Tabs content */}
                  <div className="tab-content" id="ex1-content">
                    <div className="tab-pane fade show active">
                      <ul className="list-group mb-0">
                        {getData.map((item: TodoLists) => (
                          <li
                            key={item.id}
                            className="list-group-item d-flex align-items-center justify-content-between border-0 mb-2 rounded"
                            style={{ backgroundColor: "#f4f6f7" }}
                          >
                            <div>
                              <input
                                className="form-check-input me-2"
                                type="checkbox"
                                checked={item.status}
                                onChange={() => handleCheckboxChange(item.id)}
                              />
                              <span
                                style={{
                                  textDecoration: item.status
                                    ? "line-through"
                                    : "none",
                                }}
                              >
                                {item.name}
                              </span>
                            </div>
                            <div className="d-flex gap-3">
                              <i
                                className="fas fa-pen-to-square text-warning"
                                onClick={() =>
                                  handleEditClick(item.id, item.name)
                                }
                              />
                              <i
                                className="far fa-trash-can text-danger"
                                onClick={() => handleDeleteClick(item.id)}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {/* Tabs content */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showErrorModal && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Cảnh báo</h5>
              <i className="fas fa-xmark" onClick={closeModal} />
            </div>
            <div className="modal-body-custom">
              <p>{error}</p>
            </div>
            <div className="modal-footer-footer">
              <button className="btn btn-light" onClick={closeModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Xác nhận</h5>
              <i className="fas fa-xmark" onClick={closeDeleteModal} />
            </div>
            <div className="modal-body-custom">
              <p>Bạn chắc chắn muốn xóa công việc này?</p>
            </div>
            <div className="modal-footer-footer">
              <button className="btn btn-light" onClick={closeDeleteModal}>
                Hủy
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
