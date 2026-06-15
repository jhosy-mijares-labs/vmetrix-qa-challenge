/**
 * Datos inválidos para tests de validación del formulario de checkout.
 * Los datos válidos (firstName, lastName, zip) están en src/data/users.ts
 * porque son propios del perfil del usuario.
 */
export const CHECKOUT_INVALID = {
  noFirstName: { firstName: '',    lastName: 'García', zip: '10001' },
  noLastName:  { firstName: 'Ana', lastName: '',       zip: '10001' },
  noZip:       { firstName: 'Ana', lastName: 'García', zip: ''      },
} as const;
