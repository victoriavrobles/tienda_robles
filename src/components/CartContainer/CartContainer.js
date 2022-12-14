import React, {useContext, useState} from "react";
import { CartContext } from "../../context/CartContext";
import {Link} from "react-router-dom";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Button, Container, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { db } from "../../utils/firebase"
import {collection, addDoc} from "firebase/firestore";
import { Box } from "@mui/system";

export const CartContainer = () => {
    const {listaProductosCart, removeItem, clear, precioTotal} = useContext(CartContext);
    const [idOrden, setIdOrden] = useState();

    const enviarOrden = (event) => {
        event.preventDefault();
        const orden = {
            comprador: {name: event.target[0].value,
                        phone: event.target[1].value, 
                        email: event.target[2].value}, 
                        items: listaProductosCart, 
                        total: precioTotal()
        }

        const queryRef = collection(db, "orders");
        addDoc(queryRef, orden).then(response=>{console.log("response", response);
        setIdOrden(response.id)
        clear();
        });
    }

    return (
    <Container sx={{mb: '100px'}}>
        <Typography variant="h4" sx={{textAlign:'center', margin: '20px'}}>Tu pedido</Typography>
        {idOrden ? 
        <>
        <Alert severity="success" sx={{padding: "10px", margin: "10px"}}>Su compra fue realizada! Número de orden: {idOrden}</Alert>
        </>
        :
        <div>
        {
        listaProductosCart.length > 0 ? 
        <div className="cartcont">
            <TableContainer component={Paper} sx={{my: "30px"}}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
          <TableRow>
           <TableCell></TableCell>
            <TableCell>Producto</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Precio unitario</TableCell>
            <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {listaProductosCart.map(item => (
                <TableRow key={item.id}>
                    <TableCell><img height="90" width="72" src={item.image} alt={item.title}/></TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell><Button variant="outlined" color="error" onClick={()=>removeItem(item.id)}>Eliminar producto</Button></TableCell>
                </TableRow>
            ))}
            </TableBody>
            </Table>
            </TableContainer>

<Grid container spacing={2}>
    <Grid md={6} item={true}>
    <Typography variant="h5" sx={{m: "20px"}}>Finalizar compra</Typography>
    <Divider variant="middle" />
    <Stack sx={{display: 'flex', flexDirection: 'column', m: "15px"}}>
    <form onSubmit={enviarOrden}>
                    <div><TextField fullWidth id="name" label="Nombre" variant="filled" sx={{mb: "10px"}}/></div>
                    <div><TextField fullWidth id="phone" label="Telefono" variant="filled" sx={{mb: "10px"}}/></div>
                    <div><TextField fullWidth id="mail" label="Email" variant="filled" sx={{mb: "10px"}}/></div>
                    <div><TextField fullWidth id="mailrepeat" label="Repetir Email" variant="filled" sx={{mb: "10px"}}/></div>
                    <Button type="submit" fullWidth variant="contained">Enviar orden</Button>
                </form>
    </Stack>
    </Grid>
    <Grid md={6} item={true}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" sx={{m: "20px"}}>Total</Typography>
        <Divider variant="middle"/>
        <Typography variant="h6" align="center" sx={{m: "15px"}}>Precio total: ${precioTotal()}</Typography>
        <Button variant="outlined" color="error" sx={{padding: "10px", margin: "10px"}} onClick={()=>clear()}>Vaciar carrito</Button>
        </Box>
    </Grid>
</Grid>
</div>
                : <>
                <Alert severity="info" sx={{padding: "10px", margin: "10px"}}>El carrito esta vacio</Alert>
                <Button><Link to="/">Volver a la página principal</Link></Button>
                </>
        }
    </div>
}
</Container>
    )
}