const checkDays = (date, days) => {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

class Room {
    constructor({ name, bookings, rate, discount }) {
        this.name = name;
        this.bookings = bookings;
        this.rate = rate;
        this.discount = discount;
    }

    isOccupied(date) {
        const checkDate = new Date(date);
        if (this.bookings) {
            return this.bookings.some(booking => {
                const checkIn = new Date(booking.checkIn);
                const checkOut = new Date(booking.checkOut);
                return checkDate >= checkIn && checkDate < checkOut;
            });
        }
        return false;
    }

    occupancyPercentage(start, end) {
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

    static totalOccupancyPercentage(rooms, startDate, endDate) {
        if (!rooms) {
            throw('No rooms selected');
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

    static availableRooms(rooms, startDate, endDate) {
        return rooms.filter(room => room.occupancyPercentage(startDate, endDate) === 0);
    }
}

class Booking {
    constructor({ name, email, checkIn, checkOut, discount = 0, room }) {
        this.name = name;
        this.email = email;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.discount = discount;
        this.room = room;
    }

    getFee() {
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

module.exports = {Room, Booking};