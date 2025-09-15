class Job {
    constructor(id, payload, delay, attempts) {
        this.id = id;
        this.payload = payload;
        this.executeAt = Date.now() + delay;
        this.attempts = attempts
    }
}
class ReadyQueueNode {
    constructor(job) {
        this.job = job;
        this.next = null;
    }
}

class ReadyQueue {
    constructor() {
        this.front = null;
        this.rear = null;
        this.size = 0;
    }

    enqueue(job) {
        if (this.isEmpty()) {
            let newJob = new ReadyQueueNode(job)
            this.front = newJob;
            this.rear = newJob;
        }
        else {
            let newJob = new ReadyQueueNode(job)
            this.rear.next = newJob;
            this.rear = newJob;
        }
        this.size++;
    }

    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        const dataToBeRemoved = this.front;
        this.front = dataToBeRemoved.next
        if (this.front === null) this.rear = null;
        this.size--;
        return dataToBeRemoved.job;
    }

    isEmpty() {
        return this.size === 0;
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.front;
    }

    print() {
        let current = this.front;
        const elements = [];
        while (current) {
            elements.push(current.job.payload);
            current = current.next;
        }
        console.log(elements.join(' -> '));
    }
};

class DelayQueue {
    constructor() {
        this.heap = [];
    }

    _getParentIndex(i) { return Math.floor((i - 1) / 2) };
    _getleftChildIndex(i) { return 2 * i + 1 };
    _getRightChildIndex(i) { return 2 * i + 2 };

    enqueue(job) {
        if (this.heap.length == 0) {
            this.heap.push(job)
            return;
        }
        this.heap.push(job)
        let index = this.heap.length - 1;
        while (index > 0) {
            if (this.heap[index].executeAt < this.heap[this._getParentIndex(index)].executeAt) {
                [this.heap[this._getParentIndex(index)], this.heap[index]] = [this.heap[index], this.heap[this._getParentIndex(index)]];
            }
            index = Math.floor((index - 1) / 2)
        }
    }

    dequeueIfReady(currentTime) {
        if (this.isEmpty()) return null;
        if (this.peek().executeAt > currentTime) return null;
        const jobToAssign = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) this.heap[0] = last;

        let index = 0
        while (index < this.heap.length) {

            let leftChildIndex = this._getleftChildIndex(index)
            let rightChildIndex = this._getRightChildIndex(index)
            if (leftChildIndex >= this.heap.length) break;
            if (leftChildIndex >= this.heap.length && rightChildIndex >= this.heap.length) break;

            let smallerNodeIndex = leftChildIndex; 
            if (
                rightChildIndex < this.heap.length &&
                this.heap[rightChildIndex].executeAt < this.heap[leftChildIndex].executeAt
            ) {
                smallerNodeIndex = rightChildIndex;
            }

            if (this.heap[index].executeAt <= this.heap[smallerNodeIndex].executeAt) break;

            [this.heap[index], this.heap[smallerNodeIndex]] = [this.heap[smallerNodeIndex], this.heap[index]]

            index = smallerNodeIndex;
        }
        return jobToAssign;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.heap[0];
    }

    print() {
        console.log(this.heap.map(j => j.executeAt));
    }
};
class JobQueue {
    constructor() {

        // Queue for jobs ready to be processed immediately
        this.readyQueue = new ReadyQueue()

        // Jobs scheduled with delay; will be promoted to readyQueue later
        this.delayedQueue = new DelayQueue();

        // Tracks jobs currently being processed (for ack + timeout logic)
        this.inProgressJobs = new Map();

        // Stores jobs that failed too many times
        this.deadLetterQueue = [];

    }

    // Called to add a job to the system (immediate or delayed)
    enqueue(id, payload, delay, attempts) {
        let job = new Job()
        // Decide if it goes to readyQueue or delayedQueue based on job.delay
    }

    // Called by a worker to fetch a job that’s ready to be processed
    poll() {
        // Return next eligible job from readyQueue and track it in inProgress
    }

    // Called by a worker after job is successfully processed
    ack(jobId) {
        // Remove job from inProgressJobs and clear timeout logic
    }

    // Internal: Retry job with exponential backoff if it wasn't acked in time
    _retry(job) {
        // Increment attempts, calculate delay, re-enqueue or dead-letter
    }

    // Internal: Move job to dead-letter queue after max retries
    _moveToDeadLetter(job) {
        // Push job to deadLetterQueue and clean up
    }

    // Internal: Promote delayed jobs to readyQueue when delay expires
    _promoteDelayedJobs() {
        // Runs periodically or uses setTimeout per job
    }

    // Internal: Check inProgress jobs for timeout and trigger retries
    _cleanup() {
        // Detect stuck jobs and reroute them via _retry
    }
}

export default JobQueue;





// const rq = new ReadyQueue();

// rq.enqueue({ id: 1, payload: 'first job' });
// rq.enqueue({ id: 2, payload: 'second job' });
// rq.enqueue({ id: 3, payload: 'third job' });

// console.log('Queue after 3 enqueues:');
// rq.print();

// const job1 = rq.dequeue();
// console.log('Dequeued:', job1);

// console.log('Queue now:');
// rq.print();

// console.log('Peek:', rq.peek());
// console.log('Is empty?', rq.isEmpty());

// rq.dequeue();
// rq.dequeue();
// console.log('Is empty after removing all?', rq.isEmpty()); 
