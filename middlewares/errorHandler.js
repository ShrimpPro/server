const errorHandler = (error, req, res, next) => {
  console.log(error);
  switch (error.name) {
    case 'ValidationError':
      res.status(400).json({ message: error.message });
      break;

    case 'EmailPasswordRequired':
      res.status(400).json({ message: 'Email and Password is required' });
      break;

    case 'AmountRequired':
      res.status(400).json({ message: 'Amount is required' });
      break;

    case 'EmailPasswordInvalid':
      res.status(401).json({ message: 'Email or Password is invalid' });
      break;
    
    case 'Unauthenticated':
    case 'JsonWebTokenError':
      res.status(401).json({ message: 'Please login first' });
      break;
  
    default:
      res.status(500).json({ message: 'Internal Server Error' });
      break;
  }
}



module.exports = { errorHandler };
