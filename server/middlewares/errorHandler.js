const errorHandler = (error, req, res, next) => {
  console.log(error);
  switch (error.name) {
    case 'dummy':
      res.status(200).json({ error: error.message });
      break;
  
    default:
      res.status(500).json({ message: 'Internal Server Error' });
      break;
  }
}

module.exports = errorHandler;