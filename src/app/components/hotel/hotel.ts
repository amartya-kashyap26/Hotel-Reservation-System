import { Component, OnInit } from '@angular/core';
import { Room } from '../models/room.model';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '../../../../node_modules/@angular/common/types/_common_module-chunk';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-hotel',
  standalone: true,
  templateUrl: './hotel.html',
  styleUrls: ['./hotel.css'],
  imports: [NgFor, FormsModule],
})
export class Hotel implements OnInit {
  rooms: Room[] = [];
  roomCount: number = 1;

  ngOnInit() {
    this.generateRooms();
  }

  generateRooms() {
    // Floors 1–9
    for (let floor = 1; floor <= 9; floor++) {
      for (let i = 1; i <= 10; i++) {
        this.rooms.push({
          roomNumber: floor * 100 + i,
          floor,
          isBooked: false,
        });
      }
    }

    // Floor 10
    for (let i = 1; i <= 7; i++) {
      this.rooms.push({
        roomNumber: 1000 + i,
        floor: 10,
        isBooked: false,
      });
    }
  }
  randomizeRooms() {
    this.rooms.forEach((room) => {
      room.isBooked = Math.random() > 0.3;
    });
  }

  resetRooms() {
    this.rooms.forEach((room) => (room.isBooked = false));
  }

  getAvailableRooms() {
    return this.rooms.filter((r) => !r.isBooked);
  }

  findSameFloorRooms(count: number) {
    const floors = new Map<number, Room[]>();

    this.getAvailableRooms().forEach((room) => {
      if (!floors.has(room.floor)) {
        floors.set(room.floor, []);
      }
      floors.get(room.floor)?.push(room);
    });

    for (let [_, rooms] of floors) {
      if (rooms.length >= count) {
        return rooms.slice(0, count);
      }
    }

    return null;
  }

  calculateTravelTime(rooms: Room[]) {
    const sorted = [...rooms].sort((a, b) => a.roomNumber - b.roomNumber);

    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const vertical = Math.abs(first.floor - last.floor) * 2;
    const horizontal = Math.abs((first.roomNumber % 100) - (last.roomNumber % 100));

    return vertical + horizontal;
  }

  getCombinations(arr: Room[], k: number): Room[][] {
    const result: Room[][] = [];

    function helper(start: number, path: Room[]) {
      if (path.length === k) {
        result.push([...path]);
        return;
      }

      for (let i = start; i < arr.length; i++) {
        path.push(arr[i]);
        helper(i + 1, path);
        path.pop();
      }
    }

    helper(0, []);
    return result;
  }

  findBestCombination(count: number) {
    const available = this.getAvailableRooms();

    let best: Room[] = [];
    let minTime = Infinity;

    const combos = this.getCombinations(available, count);

    combos.forEach((combo) => {
      const time = this.calculateTravelTime(combo);

      if (time < minTime) {
        minTime = time;
        best = combo;
      }
    });

    return best;
  }

  bookRooms(count: number) {
    if (!count || count < 1 || count > 5) {
      alert('Enter between 1–5 rooms');
      return;
    }

    let selected = this.findSameFloorRooms(count);

    if (!selected) {
      selected = this.findBestCombination(count);
    }

    selected.forEach((r) => (r.isBooked = true));
  }
}
