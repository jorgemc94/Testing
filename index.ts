const checkDays = (date: string | Date, days: number): Date => {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

interface BookingDetails {
    name: string;
    email: string;
    checkIn: string ;
    checkOut: string ;
    discount: number;
    room: Room;
}

class Booking {
    name: string;
    email: string;
    checkIn: Date;
    checkOut: Date;
    discount: number;
    room: Room;

    constructor({ name, email, checkIn, checkOut, discount = 0, room }: BookingDetails) {
        this.name = name;
        this.email = email;
        this.checkIn = new Date(checkIn);
        this.checkOut = new Date(checkOut);
        this.discount = discount;
        this.room = room;
    }

    getFee(): number {
        const originalPrice = this.room.rate;
        const roomDiscount = this.room.discount || 0;
        const bookingDiscount = this.discount || 0;

        if (originalPrice === 0 || roomDiscount >= 100 || bookingDiscount >= 100) {
            return 0;
        }

        const basePrice = originalPrice * (100 - roomDiscount) / 100;
        const finalPrice = basePrice * (100 - bookingDiscount) / 100;

        return finalPrice;
    }
}

interface RoomDetails {
    name: string;
    bookings: BookingDetails[];
    rate: number;
    discount: number;
}

class Room {
    name: string;
    bookings: Booking[];
    rate: number;
    discount: number;

    constructor({ name, bookings, rate, discount }: RoomDetails) {
        this.name = name;
        this.bookings = bookings.map(booking => new Booking(booking));
        this.rate = rate;
        this.discount = discount;
    }

    isOccupied(date: string | Date): boolean {
        const checkDate = new Date(date);
        return this.bookings.some(booking => {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);
            return checkDate >= checkIn && checkDate < checkOut;
        });
    }

    occupancyPercentage(start: string | Date, end: string | Date): number {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / millisecondsPerDay) + 1;

        let occupiedDays = 0;
        for (let i = 0; i < totalDays; i++) {
            if (this.isOccupied(checkDays(start, i))) {
                occupiedDays++;
            }
        }
        const percentage = ((occupiedDays / totalDays) * 100).toFixed(2);
        const floatPercentage = parseFloat(percentage);
        return floatPercentage;
    }

    static totalOccupancyPercentage(rooms: Room[], startDate: string | Date, endDate: string | Date): number {
        if (!rooms.length) {
            throw new Error('No rooms selected');
        }
        let aggregatePercentage = 0;
        rooms.forEach(room => {
            const individualPercentage = room.occupancyPercentage(startDate, endDate);
            aggregatePercentage += individualPercentage;
        });
        const totalPercentage = (aggregatePercentage / rooms.length).toFixed(2);
        const result = parseFloat(totalPercentage);
        return result;
    }

    static availableRooms(rooms: Room[], startDate: string | Date, endDate: string | Date): Room[] {
        return rooms.filter(room => room.occupancyPercentage(startDate, endDate) === 0);
    }
}

export { Room, Booking };
