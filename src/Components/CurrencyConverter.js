import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, MenuItem, Button, Box, Typography } from '@mui/material';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [currencies, setCurrencies] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    axios.get('https://api.exchangerate-api.com/v4/latest/USD')
      .then(response => {
        const currencyData = response.data.rates;
        setCurrencies(Object.keys(currencyData));
      })
      .catch(error => console.error('Error fetching currencies:', error));
  }, []);

  const convertCurrency = () => {
    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      return;
    }

    axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then(response => {
        const rate = response.data.rates[toCurrency];
        setConvertedAmount(amount * rate);
      })
      .catch(error => console.error('Error converting currency:', error));
  };

  return (
    <Box sx={{ p: 2, maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Conversor de Moedas</Typography>
      <TextField
        label="Valor"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="De"
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        fullWidth
        margin="normal"
      >
        {currencies.map(currency => (
          <MenuItem key={currency} value={currency}>
            {currency}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Para"
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        fullWidth
        margin="normal"
      >
        {currencies.map(currency => (
          <MenuItem key={currency} value={currency}>
            {currency}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="contained" color="primary" onClick={convertCurrency} fullWidth>
        Converter
      </Button>
      {convertedAmount !== null && (
        <Typography variant="h6" gutterBottom>
          {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
        </Typography>
      )}
    </Box>
  );
};

export default CurrencyConverter;
