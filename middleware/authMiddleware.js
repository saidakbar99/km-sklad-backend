import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // const token = req.cookies.token;

  // if (!token) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  //   if (err) {
  //     return res.status(403).json({ message: 'Forbidden' });
  //   }
  //   req.user = user;
  //   next();
  // });
};

export const checkRole = (role) => (req, res, next) => {
  // if (req.user.role !== role) {
  //   return res.status(403).json({ message: 'Access denied' });
  // }
  next();
};