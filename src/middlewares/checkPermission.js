import jwt from 'jsonwebtoken';
import User from '../models/user';

export const checkPermission = async (req,res,next)=>{
  try {
    // console.log(req.headers.authorization);
    //kiểm tra ng dùng đã đăng nhập chưa
    if(!req.headers.authorization){
      return res.status(403).json({
        message: "Bạn chưa đăng nhập",
      })
    }
    const token = req.headers.authorization.split(" ")[1];
    // console.log("token", token);
    jwt.verify(token, "tuyendz123", async(error, payload)=>{
      if(error){
        if (error.name == "TokenExpiredError") {
          return res.json({
              message: "Token không hợp lệ",
          });
      }
      if (error.name == "TokenExpiredError") {
          return res.json({
              message: "Token hết hạn",
          });
      }
      }
      const user = await User.findById(payload.id);
      // console.log(user);
      if (user && user.role !== "admin") {
        return res.status(403).json({
            message: "Bạn không có quyền truy cập tài nguyên, next!",
        });
      }
      next();
    })
  } catch (error) {
    return res.status(401).json({
      message: error.message || "Token không hợp lệ",
  });
  }
}