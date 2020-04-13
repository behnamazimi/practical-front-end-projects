'use strict';

/**
 * Cell class representing a cell of game board
 *
 * @class
 */
class Cell {

    /**
     * Cell creator
     *
     * @param {number} x - Coordinate on X axis of board
     * @param {number} y - Coordinate on Y axis of board
     * @param {string|null} owner - Specify the owner on cell (black/white)
     */
    constructor(x, y, owner = null) {
        this.x = x;
        this.y = y;
        this._owner = owner;
    }

    /**
     * return coordinate of cell as [x,y]
     *
     * @returns {number[]} - First index is X and second is Y
     */
    pos() {
        return [this.x, this.y]
    }

    /**
     * Getter for cell owner
     * @returns {string}
     */
    get owner() {
        return this._owner;
    }

    /**
     * Setter for cell owner
     * @param {string} owner - Value of cell owner (black/white)
     */
    set owner(owner) {
        this._owner = owner;
    }

    /**
     * Possible around neighbors of a cell will return as coordinates
     *
     * @returns {number[]}
     */
    neighbors() {
        return [
            [this.x - 1, this.y - 1], [this.x - 1, this.y], [this.x - 1, this.y + 1],
            [this.x, this.y - 1], [this.x, this.y + 1],
            [this.x + 1, this.y - 1], [this.x + 1, this.y], [this.x + 1, this.y + 1],
        ];
    }

}
