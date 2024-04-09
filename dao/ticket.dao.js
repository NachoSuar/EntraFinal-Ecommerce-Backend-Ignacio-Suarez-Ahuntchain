import Ticket from "./models/ticket.schema";

class TicketDAO {
  static async createTicket(ticketData) {
    try {
      const ticket = new Ticket(ticketData);
      return await ticket.save();
    } catch (error) {
      console.error('Error al crear el ticket:', error);
      throw error;
    }
  }
}

export default TicketDAO;
