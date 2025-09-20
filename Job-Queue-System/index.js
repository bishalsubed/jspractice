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

        this.readyQueue = new ReadyQueue()

        this.delayedQueue = new DelayQueue();

        this.inProgressJobs = new Map();

        this.deadLetterQueue = [];

        this.completedLetterQueue = [];

        this.isPolling = false;
        this._pendingPolls = [];
    }

    enqueue(id, payload, delay = 0, attempts = 1) {
        let job = new Job(id, payload, delay, attempts)
        if (job.executeAt <= Date.now()) {
            this.readyQueue.enqueue(job)
        } else {
            this.delayedQueue.enqueue(job)
        }
    }

    async poll() {
        return new Promise((resolve, reject) => {
            if (this.isPolling) {
                this._pendingPolls.push({ resolve, reject });
                return;
            }
            this.isPolling = true
            let nextReadyJob = this.delayedQueue.dequeueIfReady(Date.now());
            if (nextReadyJob) this.readyQueue.enqueue(nextReadyJob);

            let assignedJob = this.readyQueue.dequeue();
            if (assignedJob) {
                this.inProgressJobs.set(assignedJob.id, {
                    assignedJob,
                    timeOutId: setTimeout(()=>{
                        console.log("Job assigned")
                    },2 * 1000)
                })
            }

            this.isPolling = false;

            if (this._pendingPolls.length > 0) {
                const nextWorker = this._pendingPolls.shift()
                this.poll().then(nextWorker.resolve).catch(nextWorker.reject)
            }
            if (assignedJob) { resolve(assignedJob) }
            else reject(null)
        })
    }


    ack(jobId) {
        let existingJob = this.inProgressJobs.get(jobId)
        if(!existingJob) return null;
        clearTimeout(existingJob.timeOutId)
        this.inProgressJobs.delete(jobId)
        this.completedLetterQueue.push(existingJob.assignedJob);
        return existingJob.assignedJob
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


