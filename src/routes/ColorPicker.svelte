<script lang="ts">
let { value, oninput }: { value: string; oninput: (value: string) => void } =
	$props();
</script>

<label class="picker-label" for="selected-color">
	<span>Selected color</span>
	<input
		id="selected-color"
		name="selected-color"
		type="color"
		value={value}
		oninput={(event) => oninput(event.currentTarget.value)}
	/>
</label>
