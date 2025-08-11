import { api } from '../api/axios';
import type { BookingDTO } from '../types/BookingDTO';

export async function checkUserBooks(phone:string): Promise<BookingDTO | null>{

  try{
    const response = await api.get<BookingDTO>(`/UserCheck/check`, {
      params: { phone },
      validateStatus: () => true
    });

    if (response.status === 204) {
      return null; 
    }

    if (response.status === 200) {
      return response.data; 
    }

    throw new Error("Erro inesperado");
  }catch(err){
    throw err;
    console.log("Erro: ", err);
  }
}
