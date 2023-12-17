import { error, fail } from '@sveltejs/kit';
import { Product } from '$models/products';
import { User } from '$models/users';
import { dbConnect, dbDisconnect } from '$utils/db';
import { redis } from '$lib/server/redis';
import { orderSchema } from './orderValidation.js';
import { validateData } from '$utils/utils';
import { Order } from '$models/orders';

/** @type {import('./$types').Actions} */
export const actions = {
  findProduct: async ({ request }) => {
    try {
      await dbConnect();

      const form = await request.formData();
      const product = form.get('product');
      const { formData, errors } = await validateData(form, orderSchema);

      if (errors) {
        return fail(401, {
          data: formData,
          errors: errors.fieldErrors
        });
      }

      const findProduct = await Product.findById(product);

      if (findProduct) {
        return { product: JSON.parse(JSON.stringify(findProduct)) };
      }

      return fail(404, { message: 'Producto no encontrado' });
    } catch (err) {
      console.log('Error: ', err);
      throw error(500, err);
    } finally {
      await dbDisconnect();
    }
  },
  findCustomer: async ({ request }) => {
    try {
      await dbConnect();

      const { phone } = Object.fromEntries(await request.formData());
      const findCustomer = await User.findOne({ phone: phone });

      if (findCustomer) return { customer: JSON.parse(JSON.stringify(findCustomer)) };
      return { phone: JSON.parse(JSON.stringify(phone)) };
    } catch (err) {
      console.log('Error: ', err);
      throw error(500, err);
    } finally {
      await dbDisconnect();
    }
  },
  searchProduct: async ({ request }) => {
    try {
      await dbConnect();

      const { product } = Object.fromEntries(await request.formData());

      const findProducts = await Product.find({ product: { $regex: product, $options: 'i' } });

      return { products: JSON.parse(JSON.stringify(findProducts)) };
    } catch (err) {
      console.log('Error: ', err);
      throw error(500, err);
    } finally {
      await dbDisconnect();
    }
  },
  submitOrder: async ({ request }) => {
    const phoneRegex = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/);

    try {
      await dbConnect();

      const form = await request.formData();
      const { formData, errors } = validateData(form, orderSchema);

      let findCustomer;
      if (form.get('customer') && phoneRegex.test(form.get('customer'))) {
        findCustomer = await User.findOne({ phone: form.get('customer') }).exec();
        if (!findCustomer) findCustomer = form.get('customer');
      } else {
        if (form.get('customer') === 'undefined') findCustomer = 'walk-in';
      }

      const data = Object.fromEntries(form);

      let ids = [];
      let productStock = {};
      for (const [key, value] of Object.entries(data)) {
        if (key.includes('products')) {
          ids.push(value);
          const matches = key.match(/\[(.*?)\]/g);

          if (matches) {
            for (let i = 0; i < matches.length; ++i) {
              const match = matches[i];
              const substring = match.substring(1, match.length - 1);
              productStock = {
                ...productStock,
                [value]: substring
              };
            }
          }
        }
      }

      const searchProducts = await Product.find({ _id: { $in: ids } });

      let stockIds = [];
      let updatedProductStock = {};
      let products = [];
      searchProducts.forEach((product) => {
        if (product.requiredStock) {
          for (const [key, value] of Object.entries(productStock)) {
            if (
              product._id.toString() === key.toString() &&
              Number(value) > Number(product.stock.stock)
            ) {
              stockIds.push(key);
            } else if (product._id.toString() === key.toString()) {
              updatedProductStock = {
                ...updatedProductStock,
                [key]: Number(product.stock.stock) - Number(value)
              };
            }
          }
        }

        for (const [key, value] of Object.entries(productStock)) {
          if (product._id === key) {
            const insertedProduct = { product: product, quantity: Number(value) };
            products.push(insertedProduct);
          }
        }
      });

      if (stockIds.length > 0) {
        return fail(400, {
          ids: stockIds,
          message: 'Inventario insuficiente'
        });
      }

      const paymentCash = form.get('input-cash') ? Number(form.get('input-cash')) : 0;
      const paymentCreditDebit = form.get('input-credit-debit')
        ? Number(form.get('input-credit-debit'))
        : 0;
      const paymentETransfer = form.get('input-e-transfer')
        ? Number(form.get('input-e-transfer'))
        : 0;

      const body = {
        paymentCash,
        paymentCreditDebit,
        paymentETransfer,
        customer: findCustomer,
        products,
        status: true,
        delivered: true,
        customerPayment: paymentCash + paymentCreditDebit + paymentETransfer,
        change: Number(form.get('change')),
        total: Number(form.get('total'))
      };

      if (errors) {
        return fail(401, {
          data: formData,
          errors: errors.fieldErrors
        });
      }

      let bulkOperation = [];
      if (
        !(
          Object.keys(updatedProductStock).length === 0 &&
          updatedProductStock.constructor === Object
        )
      ) {
        for (let [key, value] of Object.entries(updatedProductStock)) {
          bulkOperation.push({
            updateOne: {
              filter: { _id: key },
              update: { $set: { stock: { stock: value } } }
            }
          });
        }
      }

      await Product.bulkWrite(bulkOperation);

      const order = new Order(body);
      await order.save();

      return { success: true };
    } catch (err) {
      console.log('Error: ', err);
      throw error(500, err);
    } finally {
      await dbDisconnect();
    }
  }
};
