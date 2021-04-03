export default function Stack(display) {
    this.values = [display]
    this.index = 0
    this.size = 1

    // Stack of displays
    this.enqueue = function(display) {
        this.values.push(display)
        this.index++; this.size++;
        // console.log(this.index)
    }

    this.dequeue = function() {
        if (this.size > 1) {
            this.values.pop()
            this.index--; this.size--;
            return this.values[this.index]
        }
        
    }

    this.curr = function() {
        return this.values[this.index]
    }
}