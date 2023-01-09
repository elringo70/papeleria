<script>
	export let label;
	export let name;
	export let checked;

	export let onChange = () => {};
</script>

<div class="form-control">
	<label class="label cursor-pointer">
		<span class="label-text">{label}</span>
		<input type="checkbox" class="checkbox" {checked} {name} id={name} on:change={onChange} />
	</label>
</div>
