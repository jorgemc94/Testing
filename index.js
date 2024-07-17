"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.Room = void 0;
var checkDays = function (date, days) {
    var newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};
var Booking = /** @class */ (function () {
    function Booking(_a) {
        var name = _a.name, email = _a.email, checkIn = _a.checkIn, checkOut = _a.checkOut, _b = _a.discount, discount = _b === void 0 ? 0 : _b, room = _a.room;
        this.name = name;
        this.email = email;
        this.checkIn = new Date(checkIn);
        this.checkOut = new Date(checkOut);
        this.discount = discount;
        this.room = room;
    }
    Booking.prototype.getFee = function () {
        var originalPrice = this.room.rate;
        var roomDiscount = this.room.discount || 0;
        var bookingDiscount = this.discount || 0;
        if (originalPrice === 0 || roomDiscount >= 100 || bookingDiscount >= 100) {
            return 0;
        }
        var basePrice = originalPrice * (100 - roomDiscount) / 100;
        var finalPrice = basePrice * (100 - bookingDiscount) / 100;
        return finalPrice;
    };
    return Booking;
}());
exports.Booking = Booking;
var Room = /** @class */ (function () {
    function Room(_a) {
        var name = _a.name, bookings = _a.bookings, rate = _a.rate, discount = _a.discount;
        this.name = name;
        this.bookings = bookings.map(function (booking) { return new Booking(booking); });
        this.rate = rate;
        this.discount = discount;
    }
    Room.prototype.isOccupied = function (date) {
        var checkDate = new Date(date);
        return this.bookings.some(function (booking) {
            var checkIn = new Date(booking.checkIn);
            var checkOut = new Date(booking.checkOut);
            return checkDate >= checkIn && checkDate < checkOut;
        });
    };
    Room.prototype.occupancyPercentage = function (start, end) {
        var startDate = new Date(start);
        var endDate = new Date(end);
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        var totalDays = Math.round((endDate.getTime() - startDate.getTime()) / millisecondsPerDay) + 1;
        var occupiedDays = 0;
        for (var i = 0; i < totalDays; i++) {
            if (this.isOccupied(checkDays(start, i))) {
                occupiedDays++;
            }
        }
        var percentage = ((occupiedDays / totalDays) * 100).toFixed(2);
        var floatPercentage = parseFloat(percentage);
        return floatPercentage;
    };
    Room.totalOccupancyPercentage = function (rooms, startDate, endDate) {
        if (!rooms.length) {
            throw new Error('No rooms selected');
        }
        var aggregatePercentage = 0;
        rooms.forEach(function (room) {
            var individualPercentage = room.occupancyPercentage(startDate, endDate);
            aggregatePercentage += individualPercentage;
        });
        var totalPercentage = (aggregatePercentage / rooms.length).toFixed(2);
        var result = parseFloat(totalPercentage);
        return result;
    };
    Room.availableRooms = function (rooms, startDate, endDate) {
        return rooms.filter(function (room) { return room.occupancyPercentage(startDate, endDate) === 0; });
    };
    return Room;
}());
exports.Room = Room;
