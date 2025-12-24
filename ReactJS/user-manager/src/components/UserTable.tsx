// src/components/UserTable.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Plus, Eye, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/client';
import { User } from '../types/user';
import { CreateUserForm } from './CreateUserForm';
import { useUserStore } from '../store/useUserStore';

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const refreshTrigger = useUserStore((s) => s.refreshTrigger);
    const refresh = useUserStore((s) => s.refresh);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get<User[]>('/users');
            setUsers(res.data);
            setError(null);
            setCurrentPage(1);
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Error al cargar usuarios';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [refreshTrigger]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/users/${deleteId}`);
            toast.success('Usuario eliminado correctamente');
            refresh();
            setDeleteId(null);
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Error al eliminar');
        }
    };

    const openDetail = async (id: string) => {
        try {
            const res = await api.get<User>(`/users/${id}`);
            setSelectedUser(res.data);
        } catch (err: any) {
            toast.error('Error al cargar detalle');
        }
    };

    // Lógica de paginación
    const totalItems = users.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

            <div className="container mx-auto px-4 py-8">
                {/* Header Card */}
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <h1 className="h3 mb-1 text-gray-800 font-bold uppercase">Gestión de Usuarios</h1>
                                <p className="text-gray-500 mb-0">Administra los usuarios del sistema de forma sencilla</p>
                            </div>
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="btn btn-primary flex items-center gap-2 shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Nuevo Usuario
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-10">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="mt-4 text-gray-500">Cargando usuarios...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="alert-danger mb-4" role="alert">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* Tabla */}
                {!loading && !error && (
                    <>
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="bg-primary text-white">
                                            <tr>
                                                <th className="px-6 py-3 border-0">Nombre</th>
                                                <th className="px-6 py-3 border-0">Email</th>
                                                <th className="px-6 py-3 border-0">Edad</th>
                                                <th className="px-6 py-3 border-0">Creado</th>
                                                <th className="px-6 py-3 border-0 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedUsers.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 align-middle font-medium">{user.name}</td>
                                                    <td className="px-6 py-4 align-middle text-gray-500">{user.email}</td>
                                                    <td className="px-6 py-4 align-middle">
                                                        {user.age ? (
                                                            <span className="badge bg-blue-600 text-white">{user.age}</span>
                                                        ) : (
                                                            <span className="text-gray-500">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 align-middle text-gray-500">
                                                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 align-middle text-right">
                                                        <button
                                                            onClick={() => openDetail(user.id)}
                                                            className="btn btn-sm btn-outline-primary mr-2"
                                                            title="Ver detalle"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteId(user.id)}
                                                            className="btn btn-sm btn-outline-danger"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {paginatedUsers.length === 0 && (
                                        <div className="text-center py-10 text-gray-500">
                                            <p className="text-lg">No hay usuarios registrados</p>
                                            <p>Haz clic en "Nuevo Usuario" para comenzar</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Paginación estilo Bootstrap */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
                                <p className="text-gray-500 mb-0">
                                    Mostrando {startItem}-{endItem} de {totalItems} usuarios
                                </p>

                                <nav aria-label="Page navigation">
                                    <ul className="pagination mb-0">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => goToPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                        </li>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => goToPage(page)}>
                                                    {page}
                                                </button>
                                            </li>
                                        ))}

                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => goToPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </li>
                                    </ul>
                                </nav>

                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="form-select w-auto"
                                >
                                    <option value={10}>10 por página</option>
                                    <option value={25}>25 por página</option>
                                    <option value={50}>50 por página</option>
                                    <option value={100}>100 por página</option>
                                </select>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal Crear Usuario */}
            <Transition appear show={isCreateOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsCreateOpen(false)}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header bg-primary text-white">
                                            <Dialog.Title as="h5" className="modal-title">
                                                Crear Nuevo Usuario
                                            </Dialog.Title>
                                            <button
                                                type="button"
                                                className="btn-close btn-close-white"
                                                onClick={() => setIsCreateOpen(false)}
                                                aria-label="Close"
                                            />
                                        </div>
                                        <div className="modal-body">
                                            <CreateUserForm onClose={() => setIsCreateOpen(false)} />
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Modal Detalle */}
            <Transition appear show={!!selectedUser} as={React.Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setSelectedUser(null)}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header bg-primary text-white">
                                            <Dialog.Title as="h5" className="modal-title">
                                                Detalle del Usuario
                                            </Dialog.Title>
                                            <button
                                                type="button"
                                                className="btn-close btn-close-white"
                                                onClick={() => setSelectedUser(null)}
                                                aria-label="Close"
                                            />
                                        </div>
                                        <div className="modal-body">
                                            {selectedUser && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <strong>Nombre:</strong> {selectedUser.name}
                                                    </div>
                                                    <div>
                                                        <strong>Email:</strong> {selectedUser.email}
                                                    </div>
                                                    <div>
                                                        <strong>Edad:</strong> {selectedUser.age ?? 'No especificada'}
                                                    </div>
                                                    <div>
                                                        <strong>Creado:</strong>{' '}
                                                        {new Date(selectedUser.createdAt).toLocaleString('es-ES')}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Modal Confirmación Eliminar */}
            <Transition appear show={!!deleteId} as={React.Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setDeleteId(null)}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header bg-danger text-white">
                                            <Dialog.Title as="h5" className="modal-title">
                                                Confirmar Eliminación
                                            </Dialog.Title>
                                            <button
                                                type="button"
                                                className="btn-close btn-close-white"
                                                onClick={() => setDeleteId(null)}
                                                aria-label="Close"
                                            />
                                        </div>
                                        <div className="modal-body">
                                            <p className="text-gray-500">
                                                ¿Estás seguro de que quieres eliminar este usuario? Esta acción es permanente y no se puede deshacer.
                                            </p>
                                        </div>
                                        <div className="modal-footer p-4 flex justify-end gap-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => setDeleteId(null)}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={handleDelete}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default UserTable;