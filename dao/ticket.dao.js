import Ticket from "./models/ticket.schema.js";

class TicketDAO {
  static async createTicket(ticketData) {
    try {
      console.log('Creating ticket with data:', ticketData);
      const ticket = new Ticket(ticketData);
      console.log('New ticket instance:', ticket);
      return await ticket.save();
    } catch (error) {
      console.error('Error al crear el ticket:', error);
      throw error;
    }
  }
  
}

export default TicketDAO;
