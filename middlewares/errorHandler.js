const errorHandler = (error, req, res, next) => {
  console.log(error);
  switch (error.name) {
    case 'EmailPasswordRequired':
      res.status(400).json({ message: 'Email and Password is required' });
      break;

    case 'EmailPasswordInvalid':
      res.status(401).json({ message: 'Email or Password is invalid' });
      break;
  
    default:
      res.status(500).json({ message: 'Internal Server Error' });
      break;
  }
}

module.exports = errorHandler;