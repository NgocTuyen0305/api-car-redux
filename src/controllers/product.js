import Joi from 'joi';
import Product from '../models/product';
import Category from '../models/category';


const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  images: Joi.string().required(),
  persons: Joi.number().required(),
  calendar: Joi.number().required(),
  petrol: Joi.string().required(),
  anchor: Joi.string().required(),
  categoryId: Joi.string().required(),
});
export const getAll = async (req, res) => {
  const { _limit = 10, _sort = "createAt", _order = "asc", _page = 1 } = req.query;
  const options = {
      page: _page,
      limit: _limit,
      sort: {
          [_sort]: _order == "desc" ? -1 : 1,
      },
  };

  try {
      const {docs} = await Product.paginate({}, options);
        // console.log(docs);
      if (docs.length == 0) {
          return res.json({
              message: "Không có sản phẩm nào",
          });
      }
      return res.json(docs);
  } catch (error) {
      return res.status(400).json({
          message: error.message,
      });
  }
};
export const get = async (req, res) => {
  try {
      const id = req.params.id;
      const data = await Product.findOne({ _id: id }).populate("categoryId", "-__v");
      if (data.length === 0) {
          return res.status(200).json({
              message: "Không có sản phẩm",
          });
      }
      return res.status(200).json(data);
  } catch (error) {
      return res.status(400).json({
          message: error.message,
      });
  }
};
export const create = async (req, res) => {
  try {
      const body = req.body;
      const { error } = productSchema.validate(body);
      if (error) {
          return res.json({
              message: error.details[0].message,
          });
      }
      const product = await Product.create(body); // { name: "A", price: 19, categoryId: xxx}

      await Category.findByIdAndUpdate(product.categoryId, {
          $addToSet: {
              products: product._id,
          },
      });

      if (product.length === 0) {
          return res.status(400).json({
              message: "Thêm sản phẩm thất bại",
          });
      }
      return res.status(200).json({
          message: "Thêm sản phẩm thành công",
          product,
      });
  } catch (error) {
      return res.status(400).json({
          message: error.message,
      });
  }
};
export const remove = async (req, res) => {
  try {
      // await axios.delete(`http://localhost:3002/products/${req.params.id}`);
      const data = await Product.findByIdAndDelete(req.params.id);
      return res.json({
          message: "Xóa sản phẩm thành công",
          data,
      });
  } catch (error) {
      return res.status(400).json({
          message: error.message,
      });
  }
};
export const update = async (req, res) => {
  try {
      const data = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
      });
    //   console.log(data);
      if (!data) {
          return res.status(400).json({
              message: "Cập nhật sản phẩm thất bại",
          });
      }
      return res.json({
          message: "Cập nhật sản phẩm thành công",
          data,
      });
  } catch (error) {
      return res.status(400).json({
          message: error.message,
      });
  }
};
export const getProductByCate = async (req,res)=>{
    try {
        const categoryId = req.params.categoryId;
        const productByCate = await Product.find({categoryId})
        console.log(productByCate);
        res.json({
            message: "Lấy sản phẩm theo danh mục thành công",
            productByCate
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}