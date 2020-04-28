/**
 * this class is for control the circle and it's animating
 */
class Circle {

    /**
     * this get entrance position and radius and gradient detail
     * and generate the circle details
     *
     * @param entrance
     * @param radius
     * @param gradientColors
     */
    constructor(entrance, radius, gradientColors) {
        this._entrance = entrance;
        this._gradientColors = gradientColors;
        this._radius = radius;

        // we need to keep original radius as const
        this._originalRadius = radius;

        // to control the decrease rate of size and position
        this._perspectiveRate = 0.1;

        // initialize the xy
        this.coordinateXY();

        // initialize the variables of x, y and radius
        this.generatePositionVars();
    }

    /**
     * initialize x and y according to size of the canvas
     */
    coordinateXY() {
        switch (this._entrance) {
            case "bottomRight":
                this.x = rndNum(canvas.width * 1.1, canvas.width);
                this.y = rndNum(canvas.height * 1.2, canvas.height * 1.1);
                break;

            case "bottomCenter":
                this.x = rndNum(canvas.width / 1.5, canvas.width / 3);
                this.y = rndNum(canvas.height * 1.3, canvas.height * 1.2);
                break;

            case "bottomLeft":
                this.x = rndNum(canvas.width * -.01, canvas.width * -.02);
                this.y = rndNum(canvas.height * 1.3, canvas.height * 1.2);
                break;
        }

    };

    /**
     * initialize the variables of x, y and radius according to
     * the entrance position
     */
    generatePositionVars() {
        this.positionVars = {
            bottomRight: {
                varY: rndNum(5, 2.5),
                varX: rndNum(4, 1.5),
                varR: rndNum(this._radius * .007, this._radius * .003)
            },
            bottomCenter: {
                varY: rndNum(7, 4.5),
                varX: rndNum(.5, -.5),
                varR: rndNum(this._radius * .007, this._radius * .003)
            },
            bottomLeft: {
                varY: rndNum(5, 2.5),
                varX: rndNum(-3, -6),
                varR: rndNum(this._radius * .007, this._radius * .003)
            },
        }
    };

    /**
     * check if the circle is out of view or not
     * this is different for each entrance
     *
     * @returns {boolean}
     */
    isOutOfView() {
        switch (this._entrance) {
            case "bottomRight":
                return this.x + this._radius < 0 || this.y + this._radius < 0;

            case "bottomCenter":
                return this.y + this._radius < 0 || (this._radius < 0 && this.x > canvas.width);

            case "bottomLeft":
                return this.x + this._radius * 2 < 0 || this.y + (this._radius * 2) < 0;
        }

    };

    /**
     * generate the fill gradient of circle according
     * to the took gradient details
     *
     * @returns {CanvasGradient}
     */
    generateGradient() {

        let circleFill = ctx.createRadialGradient(
            this.x, this.y, this._radius / 2,
            this.x, this.y, this._radius);

        // loop over gradient details to add color stop
        // each item of this._gradientColors contains an offset and a color
        for (let [offset, color] of this._gradientColors) {
            circleFill.addColorStop(offset, color);
        }

        return circleFill;
    };

    /**
     * method to draw a circle on canvas with data obtained
     */
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this._radius, 0, Math.PI * 2, false);

        ctx.strokeStyle = "transparent";
        ctx.fillStyle = this.generateGradient();
        ctx.fill();
        ctx.stroke();
    };

    /**
     * calculate the change rate by percent of topOffset and perspective rate
     *
     * @param topOffset
     * @param rate
     * @returns {number}
     */
    calcChangeRate(topOffset, rate) {
        if (topOffset === 100) return 1;
        return (((topOffset - 100) / 10) * rate) + 1
    }

    /**
     * update the x, y and the radius of the circle,
     * and call draw method to re-draw it
     */
    animate() {

        // to have easy access, put entrance vars in variables
        const varY = this.positionVars[this._entrance].varY;
        const varX = this.positionVars[this._entrance].varX;
        const varR = this.positionVars[this._entrance].varR;

        // calculate the offsetTop percent of circle position
        let topOffset = 100;
        if (canvas.height - this.y + this._radius > 0) {
            topOffset = this.y * 100 / canvas.height;
        }

        // calculate the change rate for the offset
        const changeRate = this.calcChangeRate(topOffset, this._perspectiveRate);

        // update the x and y
        this.x -= Math.max(varX * changeRate, varX * .3);
        this.y -= Math.max(varY * changeRate, varY * .4);

        // update the radius
        if (topOffset > 50 && this._radius > this._originalRadius * .3) {
            this._radius -= Math.max(varR * changeRate, varR * rndNum(.5, .2));
        } else {
            this._radius -= Math.min(varR * changeRate, varR * rndNum(.2, .15))
        }

        // reset the position and the radius if the circle has gone from view
        if (this.isOutOfView() || this._radius < 1) {
            this.coordinateXY();
            this._radius = this._originalRadius;
        }

        // re-draw the circle with updated properties
        this.draw();
    };

}
