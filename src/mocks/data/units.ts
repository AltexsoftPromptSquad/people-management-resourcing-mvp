import { createUnit } from '../factories/unit-factory'

export const units = [
  createUnit({
    id: 'unit-platform',
    name: 'Platform Engineering',
    managerId: 'person-olena-kovalenko',
  }),
  createUnit({
    id: 'unit-product',
    name: 'Product Delivery',
    managerId: 'person-maksym-bondar',
  }),
  createUnit({
    id: 'unit-data',
    name: 'Data Solutions',
    managerId: 'person-iryna-melnyk',
  }),
]
