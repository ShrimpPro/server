const errorHandler = (error, req, res, next) => {
  console.log(error);
  console.log(error.name);
  switch (error.name) {
    case 'ValidationError':
    case 'MongoServerError':
      res.status(400).json({ message: error.message });
      break;

    case 'EmailPasswordRequired':
      res.status(400).json({ message: 'Email and Password is required' });
      break;

    case 'AmountRequired':
      res.status(400).json({ message: 'Amount is required' });
      break;

    case 'NoMembership':
      res.status(400).json({ message: 'You need to be a member first' });
      break;

    case 'MaximumLimit':
      res.status(400).json({ message: 'Maximum limit reached, please consider upgrading your membership' });
      break;

    case 'EmailPasswordInvalid':
      res.status(401).json({ message: 'Email or Password is invalid' });
      break;
    
    case 'Unauthenticated':
    case 'JsonWebTokenError':
      res.status(401).json({ message: 'Please login first' });
      break;

    case 'NotFound':
    case 'CastError':
      res.status(404).json({ message: 'Data not found' });
      break;
  
    default:
      res.status(500).json({ message: 'Internal Server Error' });
      break;
  }
}



module.exports = { errorHandler };
