<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  export let colors: { value: string, color: string }[] = [];
  export let defaultSelectedValue: string = '';
  let isOpen = false;
  export let selectedColor = '';
  let dropdownElement: HTMLElement;
  let anchorElement: HTMLElement;

  type ColorSelectCallback = (value: string, color: string) => void;
  let onSelect: ColorSelectCallback;

  function toggleOpen() {
    isOpen = !isOpen;
    if (isOpen) {
      setTimeout(() => {
        const firstButton = dropdownElement.querySelector('.dropdown-button');
        (firstButton as HTMLElement)?.focus();
      }, 0);
    }
  }

  function selectColor(value: string, color: string) {
    selectedColor = value;
    isOpen = false;

    if (onSelect) onSelect(value, color);
  }

  function handleKeydown(event: KeyboardEvent) {
    const buttons = Array.from(dropdownElement.querySelectorAll('.dropdown-button'));
    const currentIndex = buttons.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        const upIndex = Math.max(0, currentIndex - 2);
        (buttons[upIndex] as HTMLElement)?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        const downIndex = Math.min(buttons.length - 1, currentIndex + 2);
        (buttons[downIndex] as HTMLElement)?.focus();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        const leftIndex = Math.max(0, currentIndex - 1);
        (buttons[leftIndex] as HTMLElement)?.focus();
        break;
      case 'ArrowRight':
        event.preventDefault();
        const rightIndex = Math.min(buttons.length - 1, currentIndex + 1);
        (buttons[rightIndex] as HTMLElement)?.focus();
        break;
      case 'Enter':
        event.preventDefault();
        const activeButton = document.activeElement as HTMLElement;
        const value = activeButton.dataset.value;
        const color = activeButton.style.backgroundColor;
        selectColor(value, color);
        break;
      case 'Escape':
        isOpen = false;
        break;
    }
  }

  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownElement.contains(event.target as Node) && !anchorElement.contains(event.target as Node)) {
        isOpen = false;
      }
    };

    window.addEventListener('click', handleClickOutside);

    const handleFocusOut = (event: FocusEvent) => {
      if (isOpen && !dropdownElement.contains(event.relatedTarget as Node) && !anchorElement.contains(event.relatedTarget as Node)) {
        isOpen = false;
      }
    };

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  });

  // Set the default selected value
  onMount(() => {
    if (defaultSelectedValue) {
      const defaultColor = colors.find((color) => color.value === defaultSelectedValue);
      if (defaultColor) {
        selectedColor = defaultColor.color;
      }
    }
  });
</script>

<style>
  .container {
    position: relative;
    display: inline;
  }
  .button {
    width: 24px;
    height: 20px;
    margin: 0px;
    padding: 0px;
    padding-bottom: 3px;
  }
  .dropdown {
    background-color: rgb(255, 205, 97);
    background-image: url(/src/assets/black-felt.png), linear-gradient(rgba(255, 255, 255, 0%) 0%, rgba(255, 255, 255, 20%) 10%, rgba(255, 255, 255, 20%) 90%, rgba(255, 255, 255, 0%) 100%);
    box-shadow: 2px;
    position: absolute;
    z-index: 10;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    max-height: 200px;
    overflow-y: auto;
    left: 100%;
    transform: translateX(-100%);
  }
  .dropdown-button {
    width: 24px;
    height: 24px;
  }
</style>

<div class="container" bind:this={dropdownElement}>
  <button 
    type="button"
    class="button" 
    aria-haspopup="true" 
    aria-expanded="{isOpen}" 
    on:click={toggleOpen} 
    on:keydown={handleKeydown}
    style="background-color: {(colors.find((color) => color.value === selectedColor)).color}"
    bind:this={anchorElement}
  ></button>
  {#if isOpen}
    <div class="dropdown">
      {#each colors as { value, color }}
        <button 
          type="button"
          class="dropdown-button" 
          style="background-color: {color};"
          data-value={value}
          on:click={() => selectColor(value, color)}
          on:keydown={handleKeydown}
        ></button>
      {/each}
    </div>
  {/if}
</div>
