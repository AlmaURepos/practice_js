function testIndividualListeners(containerId, itemCount) {
    const container = document.getElementById(containerId);
    const startTime = performance.now();
    // Attach listener to EACH element
    for (let i = 1; i <= itemCount; i++) {
        const item = container.querySelector(`[data-id="todo-${i}"]`);
        if (item) {
            const checkbox = item.querySelector('input[type="checkbox"]');
            checkbox.addEventListener("change", () => {
                item.classList.toggle("completed", checkbox.checked);
            });
        }
    }
    
    const endTime = performance.now();
        return endTime- startTime;
    }

    function testEventDelegation(containerId) {
        const container = document.getElementById(containerId);
        const startTime = performance.now();
        // Single listener on parent
        container.addEventListener("change", (e) => {
            if (e.target.type === "checkbox") {
                const item = e.target.closest(".todo-item");
                item.classList.toggle("completed", e.target.checked);
            }
        });
    
        const endTime = performance.now();
        return endTime- startTime;
    }

console.log("Individual listeners (1000 items):",
testIndividualListeners("todo-list", 1000), "ms");
console.log("Event delegation:", testEventDelegation("todo-list"),"ms");