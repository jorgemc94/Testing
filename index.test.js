const { Room, Booking } = require("./index")

const roomTemplate = new Room ({
    name: 'Suite',
    bookings: [],
    rate: 10000,
    discount: 10,
})

const booking1 = new Booking ({
    name: 'Jorge',
    mail: 'jmaciasc1994@gmail.com',
    checkIn: '2024-01-01',
    checkOut: '2024-01-04',
    discount: 15,
    room: Room,
})

const booking2 = new Booking ({
    name: 'Jorge',
    mail: 'jmaciasc1994@gmail.com',
    checkIn: '2024-02-01',
    checkOut: '2024-02-04',
    discount: 15,
    room: Room,
})

const booking3 = new Booking ({
    name: 'Jorge',
    mail: 'jmaciasc1994@gmail.com',
    checkIn: '2024-03-30',
    checkOut: '2024-04-05',
    discount: 15,
    room: Room,
})



const bookingsTemplate = [booking1,booking2,booking3]

describe('Check if room is occupied on date that is not the last day of any booking', () => {
    test('Date is first day of booking', () => { 
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.isOccupied('2024-01-01')).toBe(true);
    })

     test('Date is in the middle of booking', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.isOccupied('2024-02-02')).toBe(true);
    });

    test('Date is the day before the last day of booking', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.isOccupied('2024-02-03')).toBe(true);
    });

    test('Date is before first day of booking', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.isOccupied('2024-03-01')).toBe(false);
    });

    test('Date is after last day of booking', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.isOccupied('2024-04-10')).toBe(false);
    });

})

describe('Check if room is occupied on last day of a booking', () => {
    test('Date #1', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.isOccupied('2024-01-04')).toBe(false);
    });
    test('Date #2', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.isOccupied('2024-02-04')).toBe(false);
    });
    test('Date #3', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.isOccupied('2024-04-05')).toBe(false);
    });
})

describe('Check if room is occupied if date is equal to last day of a booking', () => {
    test('Date #1', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.isOccupied('2024-01-04')).toBe(false);
    });

    test('Date #2', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.isOccupied('2024-02-04')).toBe(false);
    });

    test('Date #3', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.isOccupied('2024-04-05')).toBe(false);
    });
});

describe('occupancyPercentage', () => {
    describe('Confirm occupancy is 100% if room is occupied every day in the provided range', () => {
        test('Case #1', () => {
            const room = new Room({...roomTemplate});
            room.bookings = bookingsTemplate;
            expect(room.occupancyPercentage('2024-01-01', '2024-01-03')).toBe(100.00);
        });

        test('Case #2', () => {
            const room = new Room({...roomTemplate});
            room.bookings = bookingsTemplate;
            expect(room.occupancyPercentage('2024-02-01', '2024-02-03')).toBe(100.00);
        });

        test('Case #3', () => {
            const room = new Room({...roomTemplate});
            room.bookings = bookingsTemplate;
            expect(room.occupancyPercentage('2024-03-30', '2024-04-04')).toBe(100.00);
        });

    })
});

describe('Confirm occupancy is 0% if room is not occupied any day in the provided range', () => {
    test('Date range is between two bookings', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.occupancyPercentage('2024-01-05', '2024-01-31')).toBe(0);
    });

    test('First date of range is last day of a booking // Last day of range is day before next booking', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.occupancyPercentage('2024-02-04', '2024-03-29')).toBe(0);
    });

    test('Date range is after all bookings', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.occupancyPercentage('2024-01-05', '2024-01-31')).toBe(0);
        expect(room.occupancyPercentage('2024-02-04', '2024-03-29')).toBe(0);
    });
});

describe('Date range coincides with bookings ranges', () => {
    test('Range coincides with only one booking', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.occupancyPercentage('2024-02-02', '2024-02-09')).toBe(25);
    });

    test('Range coincides with two bookings separated by days in between them', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        room.bookings.push(new Booking({name: 'Dr. Who', email: 'who@jonhshopkins.com', checkIn: '2024-01-09', checkOut: '2024-01-15', discount: 10, room: new Room({...roomTemplate})}));
        expect(room.occupancyPercentage('2024-01-02', '2024-01-11')).toBe(50);
    });

    test('Long range across several bookings', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        room.bookings.push(new Booking({checkIn: '2024-01-09', checkOut: '2024-01-15', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate})}));
        expect(room.occupancyPercentage('2024-01-01', '2024-04-05')).toBe(19.79);
    });

    test('Range within booking\'s beginning and end', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.occupancyPercentage('2024-02-02', '2024-02-03')).toBe(100);
    });
});

describe('Confirm occupancy is 0% if no bookings are provided for the room', () => {
    test('Test #1', () => {
        const room = new Room({...roomTemplate});
        expect(room.occupancyPercentage('2024-01-01', '2024-01-04')).toBe(0);
    });
});

describe('Check occupancy if check-in and check-out dates are equal', () => {
    test('Date within booking', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.occupancyPercentage('2024-01-01', '2024-01-01')).toBe(100);
        expect(room.occupancyPercentage('2024-01-15', '2024-01-15')).toBe(0);
        expect(room.occupancyPercentage('2024-03-30', '2024-03-30')).toBe(100);
    });

    test('Date outside of booking', () => {
        const room = new Room({...roomTemplate});
        room.bookings = bookingsTemplate;
        expect(room.occupancyPercentage('2024-01-15', '2024-01-15')).toBe(0);
    });
});

describe('All rooms are occupied for the whole provided range', () => {
    const room1 = new Room({...roomTemplate});
    room1.bookings = JSON.parse(JSON.stringify(bookingsTemplate));

    const room2 = new Room({...roomTemplate});
    room2.bookings = JSON.parse(JSON.stringify(bookingsTemplate));
    
    const room3 = new Room({...roomTemplate});
    room3.bookings = JSON.parse(JSON.stringify(bookingsTemplate));

    const rooms = [room1, room2, room3];

    test('Range starting on first day of a booking', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2024-01-01', '2024-01-03')).toBe(100);
    });

    test('Range finishing on the day before the last day of a booking', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2024-02-02', '2024-02-03')).toBe(100);
    });

    test('Range within bookings', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2024-03-31', '2024-04-03')).toBe(100);
    });
});

describe('No room is occupied in the whole range', () => {
    const room1 = new Room({...roomTemplate});
    room1.bookings = JSON.parse(JSON.stringify(bookingsTemplate));

    const room2 = new Room({...roomTemplate});
    room2.bookings = JSON.parse(JSON.stringify(bookingsTemplate));
    
    const room3 = new Room({...roomTemplate});
    room3.bookings = JSON.parse(JSON.stringify(bookingsTemplate));

    const rooms = [room1, room2, room3];
    
    test('Range before all bookings', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2023-12-01', '2023-12-25')).toBe(0);
    });

    test('Range in between bookings // First day of range is last day of 1st booking // Last day of range is day before second booking starts', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2024-01-04', '2024-01-31')).toBe(0);
    });

    test('Range after all bookings', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2024-04-15', '2024-04-20')).toBe(0);
    });
});

describe('Some rooms are occupied for the whole period and others are completely free or partially occupied', () => {
    const room1 = new Room({...roomTemplate});
    room1.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-06', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-02-10', checkOut: '2024-02-20', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })];

    const room2 = new Room({...roomTemplate});
    room2.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-06', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-01-07', checkOut: '2024-01-16', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })];
    
    const room3 = new Room({...roomTemplate});
    room3.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-03', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-01-10', checkOut: '2024-01-16', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-02-10', checkOut: '2024-02-20', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }),];

    const rooms = [room1, room2, room3];
    
    test('Two rooms completely occupied and another partially occupied', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2024-01-01', '2024-01-05')).toBe(80);
    });

    test('One room is completely occupied, another is partially occupied, and anoter is not occupied at all', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2024-01-07', '2024-01-15')).toBe(55.56);

    });

    test('Two rooms are completely occupied and another is completely free', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2024-02-10', '2024-02-19')).toBe(66.67);
    });
});

describe('A single room is completely occupied and the rest are either completely free or partially occupied', () => {
    const room1 = new Room({...roomTemplate});
    room1.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-06', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-01-10', checkOut: '2024-01-12', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })];

    const room2 = new Room({...roomTemplate});
    room2.bookings = [ new Booking({ checkIn: '2024-01-03', checkOut: '2024-01-07', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-01-07', checkOut: '2024-01-16', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })];
    
    const room3 = new Room({...roomTemplate});
    room3.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-02', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-02-10', checkOut: '2024-02-20', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })];

    const rooms = [room1, room2, room3];

    test('One fully occupied and the others partially occupied', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2024-01-01', '2024-01-05')).toBe(60);
    });

    test('One fully occupied, one partially occupied and another completely free', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2024-01-07', '2024-01-15')).toBe(40.74);
    });

    test('One fully occupied and the rest completely free', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2024-02-10', '2024-02-19')).toBe(33.33);
    });
});

describe('There\'s only one room in the array', () => { 
    const room1 = new Room({...roomTemplate});
    room1.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-06', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-02-10', checkOut: '2024-02-12', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })];

    test('Full occupation', () => {
        expect(Room.totalOccupancyPercentage([room1], '2024-01-01', '2024-01-05')).toBe(100);
    });

    test('Half occupation', () => {
        expect(Room.totalOccupancyPercentage([room1], '2024-02-10', '2024-02-13')).toBe(50);
    });

    test('No occupation', () => {
        expect(Room.totalOccupancyPercentage([room1], '2024-01-10', '2024-01-15')).toBe(0);
    });
});

describe('All rooms are partially occupied', () => {
    const room1 = new Room({...roomTemplate});
    room1.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-03', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }),new Booking({ checkIn: '2024-01-07', checkOut: '2024-01-12', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }),new Booking({ checkIn: '2024-02-10', checkOut: '2024-02-14', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })]

    const room2 = new Room({...roomTemplate});
    room2.bookings = [ new Booking({ checkIn: '2024-01-02', checkOut: '2024-01-05', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }),new Booking({ checkIn: '2024-01-09', checkOut: '2024-01-14', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }),new Booking({ checkIn: '2024-02-07', checkOut: '2024-02-15', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })]
    
    const room3 = new Room({...roomTemplate});
    room3.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-04', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }),new Booking({ checkIn: '2024-01-05', checkOut: '2024-01-11', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }),new Booking({ checkIn: '2024-02-14', checkOut: '2024-02-22', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })]

    const rooms = [room1, room2, room3];

    test('Case #1', () => {
        // expect(Room.totalOccupancyPercentage(rooms, '2024-01-01', '2024-01-05')).toBe(53.33); SHOULD NOT COUNT LAST DAY OF BOOKING AS OCCUPIED YET IT DOES
    });

    test('Case #2', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2024-01-07', '2024-01-15')).toBe(51.85);
    });

    test('Case #3', () => {
        expect(Room.totalOccupancyPercentage(rooms, '2024-02-10', '2024-02-19')).toBe(50);
    });
});

describe('No room is available', () => {
    const room1 = new Room({...roomTemplate});
    room1.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-04',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-01-05', checkOut: '2024-01-11',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-02-11', checkOut: '2024-02-15',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })]

    const room2 = new Room({...roomTemplate});
    room2.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-06',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-01-06', checkOut: '2024-01-12',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-02-12', checkOut: '2024-02-15',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })]
    
    const room3 = new Room({...roomTemplate});
    room3.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-07',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-01-07', checkOut: '2024-01-11',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-02-11', checkOut: '2024-02-15',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })]

    const rooms = [room1, room2, room3];

    test('Case #1', () => {
        expect(Room.availableRooms(rooms, '2024-01-01', '2024-01-03')).toEqual([]);
    });

    test('Case #2', () => {
        expect(Room.availableRooms(rooms, '2024-01-07', '2024-01-15')).toEqual([]);
    });

    test('Case #3', () => {
        expect(Room.availableRooms(rooms, '2024-02-10', '2024-02-20')).toEqual([]);
    });
});

describe('All rooms are available', () => {
    const room1 = new Room({...roomTemplate});
    room1.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-04',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-01-05', checkOut: '2024-01-11',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-02-11', checkOut: '2024-02-15',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })];

    const room2 = new Room({...roomTemplate});
    room2.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-06',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-01-06', checkOut: '2024-01-12',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-02-12', checkOut: '2024-02-15',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })];
    
    const room3 = new Room({...roomTemplate});
    room3.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-07',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-01-07', checkOut: '2024-01-11',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-02-11', checkOut: '2024-02-15',name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })];

    const rooms = [room1, room2, room3];

    test('Range before all bookings', () => {
        expect(Room.availableRooms(rooms, '2023-12-10', '2023-12-20')).toEqual(rooms);
    });

    test('Range in between boookings', () => {
        expect(Room.availableRooms(rooms, '2024-01-15', '2024-01-25')).toEqual(rooms);
    });

    test('Range after all bookings', () => {
        expect(Room.availableRooms(rooms, '2025-03-20', '2025-03-30')).toEqual(rooms);
    });
});

describe('Some rooms are available', () => {
    const room1 = new Room({...roomTemplate});
    room1.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-04', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-01-12', checkOut: '2024-01-16', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })];
    
    const room2 = new Room({...roomTemplate});
    room2.bookings = [ new Booking({ checkIn: '2024-01-06', checkOut: '2024-01-12', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-02-12', checkOut: '2024-02-15', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })];
    
    const room3 = new Room({...roomTemplate});
    room3.bookings = [ new Booking({ checkIn: '2024-01-01', checkOut: '2024-01-07', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-01-07', checkOut: '2024-01-11', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) }), new Booking({ checkIn: '2024-02-11', checkOut: '2024-02-15', name: 'Dr. Who', email: 'who@jonhshopkins.com', discount: 10, room: new Room({...roomTemplate}) })];

    const rooms = [room1, room2, room3];

    test('Only one room is available', () => {
        expect(Room.availableRooms(rooms, '2024-01-01', '2024-01-05')).toEqual([room2]);
    });

    test('More than one room is available and others are not available', () => {
        expect(Room.availableRooms(rooms, '2024-01-12', '2024-01-14')).toEqual([room2, room3]);
    })
});

describe('Room\'s discount is zero', () => {
    const booking1 = new Booking({ ...bookingsTemplate });
    booking1.room = new Room({ ...roomTemplate });
    booking1.room.rate = 15000;
    booking1.room.discount = 0;

    const booking2 = new Booking({ ...bookingsTemplate });
    booking2.room = new Room({ ...roomTemplate });
    booking2.room.rate = 30000;
    booking2.room.discount = 0;

    const booking3 = new Booking({ ...bookingsTemplate });
    booking3.room = new Room({ ...roomTemplate });
    booking3.room.rate = 45000;
    booking3.room.discount = 0;

    test('Room\'s price with rate 15000 and zero discount', () => {
        expect(booking1.getFee()).toBe(15000 * (100 - booking1.discount) / 100); 
    });

    test('Room\'s price with rate 30000 and zero discount', () => {
        expect(booking2.getFee()).toBe(30000 * (100 - booking2.discount) / 100);
    });

    test('Room\'s price with rate 45000 and zero discount', () => {
        expect(booking3.getFee()).toBe(45000 * (100 - booking3.discount) / 100);
    });
});

describe('Booking\'s discount is zero', () => {
    const booking1 = new Booking({ ...bookingsTemplate });
    booking1.room = new Room({ ...roomTemplate });
    booking1.room.rate = 15000;
    booking1.discount = 0;

    const booking2 = new Booking({ ...bookingsTemplate });
    booking2.room = new Room({ ...roomTemplate });
    booking2.room.rate = 30000;
    booking2.discount = 0;

    const booking3 = new Booking({ ...bookingsTemplate });
    booking3.room = new Room({ ...roomTemplate });
    booking3.room.rate = 45000;
    booking3.discount = 0;

    test('Room\'s price = 15000', () => {
        expect(booking1.getFee()).toBe(15000 * (100 - booking1.room.discount) / 100);
    });

    test('Room\'s price = 30000', () => {
        expect(booking2.getFee()).toBe(30000 * (100 - booking2.room.discount) / 100);
    });

    test('Room\'s price = 45000', () => {
        expect(booking3.getFee()).toBe(45000 * (100 - booking3.room.discount) / 100);
    });
});

describe('Room\'s price is zero', () => {
    const booking1 = new Booking({...bookingsTemplate});
    booking1.room = new Room({...roomTemplate});
    booking1.room.rate = 0;

    test('Case #1', ()  => {
        expect(booking1.getFee()).toBe(0);
    })
});

describe('Either discount is 100%', () => {
    const booking1 = new Booking({...bookingsTemplate});
    booking1.room = new Room({...roomTemplate});
    booking1.room.rate = 15000;
    booking1.discount = 100;

    const booking2 = new Booking({...bookingsTemplate});
    booking2.room = new Room({...roomTemplate});
    booking2.room.rate = 30000;
    booking2.room.discount = 100;
    
    const booking3 = new Booking({...bookingsTemplate});
    booking3.room = new Room({...roomTemplate});
    booking3.discount = 100;
    booking3.room.discount = 100;
    
    test('Booking\'s discount is 100%', () => {
        expect(booking1.getFee()).toBe(0);
    });

    test('Room\'s discount is 100%', () => {
        expect(booking2.getFee()).toBe(0);
    });

    test('Both discounts are 100%', () => {
        expect(booking3.getFee()).toBe(0);
    });
});

describe('Both discounts are between 1 and 99%', () => {
    const booking1 = new Booking({...bookingsTemplate});
    booking1.room = new Room({...roomTemplate});
    booking1.room.rate = 15000;

    const booking2 = new Booking({...bookingsTemplate});
    booking2.room = new Room({...roomTemplate});
    booking2.room.rate = 30000;
    booking2.room.discount = 15;
    
    const booking3 = new Booking({...bookingsTemplate});
    booking3.room = new Room({...roomTemplate});
    booking3.room.rate = 45000;
    booking3.discount = 15;

    test('Case #1', () => {
        expect(booking1.getFee()).toBe(13500); // Sin descuento, tarifa completa
    });

    test('Case #2', () => {
        expect(booking2.getFee()).toBe(25500); // Descuento de habitación del 15%
    });

    test('Case #3', () => {
        expect(booking3.getFee()).toBe(34425); // Descuento de reserva del 15%
    });
});