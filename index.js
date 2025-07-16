class Node {
    constructor(key, value, ttl) {
        this.key = key;
        this.value = value;
        this.ttl = Date.now() + ttl * 1000;
        this.next = null;
        this.prev = null;
    }
}
class InMemoryCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.head = null;
        this.tail = null;
        this.map = new Map();

        // capacity limit
        // store key-node map
        // track head/tail of LRU linked list
        // maybe a timer or interval for TTL cleanup
    }
    get(key) {
        if (!key) return null;
        if (!this.map.has(key)) return null;
        let existingNode = this.map.get(key);
        if (existingNode.ttl < Date.now()) {
            this.removeNode(existingNode)
            return null;
        }
        this.moveToHead(existingNode)
        return existingNode.value;
        // check if key exists
        // check TTL
        // update LRU order
        // return value or null
    }

    set(key, value, ttl) {
        if (key == null || ttl == null) return null;
        if (!this.head) {
            let newValue = new Node(key, value, ttl)
            this.map.set(key, newValue)
            this.head = newValue;
            this.tail = newValue;
            return
        }
        let existingNode = this.map.get(key)
        if (existingNode) {
            existingNode.value = value;
            existingNode.ttl = Date.now() + ttl * 1000;
            this.moveToHead(existingNode)
            return;
        }
        for (let [key, node] of this.map.entries()) {
            if (node.ttl < Date.now()) {
                this.removeNode(node);
            }
        }
        if (this.map.size >= this.capacity) {
            this.removeNode(this.tail);
        }
        let newValue = new Node(key, value, ttl)
        this.map.set(key, newValue);
        newValue.next = this.head;
        this.head.prev = newValue
        this.head = newValue;


        // if key exists, update value and TTL
        // else if at capacity, evict LRU
        // add new key with TTL
        // move to head of usage list
    }

    delete(key) {
        if (!key) return null;
        if (!this.map.has(key)) return;
        let existingNode = this.map.get(key);
        this.removeNode(existingNode);
    }

    clear() {
        this.head = null;
        this.tail = null;
        this.map.clear();
    }

    printList() {
        let current = this.head
        let result = ""
        while (current) {
            result += current.value + '->'
            current = current.next
        }
        console.log(result + 'null')
    }

    moveToHead(node) {
        if (!node || this.map.size === 0) return null;
        if (this.head === node) return;
        if (node.next) {
            if (node.prev) node.prev.next = node.next;
            if (node.next) node.next.prev = node.prev;
        } else {
            this.tail = node.prev
        }
        this.head.prev = node;
        node.next = this.head;
        node.prev = null;
        this.head = node;
    }

    removeNode(node) {
        if (!node || this.map.size === 0) return null;
        if (this.map.size === 1) {
            this.head = null;
            this.tail = null;
            this.map.delete(node.key)
        } else {
            if (this.head == node) {
                node.next.prev = null;
                this.head = node.next;
                this.map.delete(node.key)
            } else if (this.tail == node) {
                node.prev.next = null;
                this.map.delete(node.key)
                this.tail = node.prev
            }
            else {
                node.next.prev = node.prev;
                node.prev.next = node.next;
                this.map.delete(node.key)
            }
        }
    }
}

const cache = new InMemoryCache(3);
cache.set('a', 1, 0.001);
cache.set("b", 5, 3)
cache.set('c', 3, 3);
cache.printList();
cache.get('a');
cache.set('d', 4, 2);
cache.printList();
