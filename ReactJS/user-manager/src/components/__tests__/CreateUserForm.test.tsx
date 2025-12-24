import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CreateUserForm } from '../CreateUserForm';

// Mock API para prevenir llamadas de red durante las pruebas
vi.mock('../../api/client', () => ({
    default: {
        post: vi.fn(),
    },
}));

describe('Feature: Formulario de Creación de Usuarios', () => {
    describe('Scenario: Usuario envía el formulario vacío', () => {
        it('El formulario debe mostrar errores de validación para los campos obligatorios', async () => {
            // GIVEN: El Formulario de Creación de Usuarios se renderiza
            render(<CreateUserForm onClose={() => { }} />);

            // WHEN: El usuario hace clic en el botón de enviar sin llenar ningún campo
            const submitButton = screen.getByRole('button', { name: /crear usuario/i });
            await userEvent.click(submitButton);

            // THEN: Deberían aparecer los mensajes de error de validación
            await waitFor(() => {
                expect(screen.getByText(/Nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument();
                expect(screen.getByText(/email inválido/i)).toBeInTheDocument();

            });
        });
    });

    describe('Scenario: Usuario ingresa un correo electrónico inválido', () => {
        it('Debe mostrar error para formato de correo electrónico inválido', async () => {
            // GIVEN: El formulario de creación de usuarios se renderiza
            render(<CreateUserForm onClose={() => { }} />);

            // WHEN: El usuario ingresa un correo electrónico inválido
            const emailInput = screen.getByLabelText(/email/i);
            await userEvent.type(emailInput, 'not-an-email');

            // AND: El usuario hace clic en el botón de enviar
            const submitButton = screen.getByRole('button', { name: /crear usuario/i });
            await userEvent.click(submitButton);

            // THEN: Debería persistir el error de validación del correo electrónico
            await waitFor(() => {
                expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
            });
        });
    });
});
