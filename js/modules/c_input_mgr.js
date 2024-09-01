class c_input_mgr {
	/* private */
	m_kb_up_key_code;
	m_kb_down_key_code;
	m_kb_left_key_code;
	m_kb_right_key_code;
	m_kb_upleft_key_code;
	m_kb_shift_key_code;
	m_kb_space_key_code;
	m_kb_enter_key_code;
	m_kb_esc_key_code;

	m_use_qwerty;
	
	/* public */
	m_kb_up_pressed = false;
	m_kb_down_pressed = false;
	m_kb_left_pressed = false;
	m_kb_right_pressed = false;
	m_kb_upleft_pressed = false;
	m_kb_shift_pressed = false;
	m_kb_space_pressed = false;
	m_kb_enter_pressed = false;
	m_kb_esc_pressed = false;

	m_kb_prev_up_pressed = false;
	m_kb_prev_down_pressed = false;
	m_kb_prev_left_pressed = false;
	m_kb_prev_right_pressed = false;
	m_kb_prev_upleft_pressed = false;
	m_kb_prev_shift_pressed = false;
	m_kb_prev_space_pressed = false;
	m_kb_prev_enter_pressed = false;
	m_kb_prev_esc_pressed = false;

	m_kb_up_triggered = false;
	m_kb_down_triggered = false;
	m_kb_left_triggered = false;
	m_kb_right_triggered = false;
	m_kb_upleft_triggered = false;
	m_kb_shift_triggered = false;
	m_kb_space_triggered = false;
	m_kb_enter_triggered = false;
	m_kb_esc_triggered = false;

	init(use_qwerty_) {
		this.m_use_qwerty = use_qwerty_;
		this.change_kb_layout(this.m_use_qwerty);
	}

	update(dt_) {
		this.m_kb_up_triggered = (this.m_kb_up_pressed !== this.m_kb_prev_up_pressed) ? true : false;
		this.m_kb_down_triggered = (this.m_kb_down_pressed !== this.m_kb_prev_down_pressed) ? true : false;
		this.m_kb_left_triggered = (this.m_kb_left_pressed !== this.m_kb_prev_left_pressed) ? true : false;
		this.m_kb_right_triggered = (this.m_kb_right_pressed !== this.m_kb_prev_right_pressed) ? true : false;
		this.m_kb_upleft_triggered = (this.m_kb_upleft_pressed !== this.m_kb_prev_upleft_pressed) ? true : false;
		this.m_kb_shift_triggered = (this.m_kb_shift_pressed !== this.m_kb_prev_shift_pressed) ? true : false;
		this.m_kb_space_triggered = (this.m_kb_space_pressed !== this.m_kb_prev_space_pressed) ? true : false;
		this.m_kb_enter_triggered = (this.m_kb_enter_pressed !== this.m_kb_prev_enter_pressed) ? true : false;
		this.m_kb_esc_triggered = (this.m_kb_esc_pressed !== this.m_kb_prev_esc_pressed) ? true : false;

		this.m_kb_prev_up_pressed = this.m_kb_up_pressed;
		this.m_kb_prev_down_pressed = this.m_kb_down_pressed;
		this.m_kb_prev_left_pressed = this.m_kb_left_pressed;
		this.m_kb_prev_right_pressed = this.m_kb_right_pressed;
		this.m_kb_prev_upleft_pressed = this.m_kb_upleft_pressed;
		this.m_kb_prev_shift_pressed = this.m_kb_shift_pressed;
		this.m_kb_prev_space_pressed = this.m_kb_space_pressed;
		this.m_kb_prev_enter_pressed = this.m_kb_enter_pressed;
		this.m_kb_prev_esc_pressed = this.m_kb_esc_pressed;
	}

	change_kb_layout(use_qwerty_) {
		if (use_qwerty_ === true) {
			this.m_kb_up_key_code = 87;
			this.m_kb_down_key_code = 83;
			this.m_kb_left_key_code = 65;
			this.m_kb_right_key_code = 68;
			this.m_kb_upleft_key_code = 81;
			this.m_kb_shift_key_code = 16;
			this.m_kb_space_key_code = 32;
			this.m_kb_enter_key_code = 13;
			this.m_kb_esc_key_code = 27;
		} else {
			this.m_kb_up_key_code = 188;
			this.m_kb_down_key_code = 79;
			this.m_kb_left_key_code = 65;
			this.m_kb_right_key_code = 69;
			this.m_kb_upleft_key_code = 222;
			this.m_kb_shift_key_code = 16;
			this.m_kb_space_key_code = 32;
			this.m_kb_enter_key_code = 13;
			this.m_kb_esc_key_code = 27;
		}
	}

	callback_keydown(key_code_) {
		this.process_keycode(key_code_, true);
	}

	callback_keyup(key_code_) {
		this.process_keycode(key_code_, false);
	}

	process_keycode(key_code_, is_pressed_) {
		if (key_code_ === this.m_kb_up_key_code) {
			this.m_kb_up_pressed = is_pressed_;
		} else if (key_code_ === this.m_kb_down_key_code) {
			this.m_kb_down_pressed = is_pressed_;
		} else if (key_code_ === this.m_kb_left_key_code) {
			this.m_kb_left_pressed = is_pressed_;
		} else if (key_code_ === this.m_kb_right_key_code) {
			this.m_kb_right_pressed = is_pressed_;
		} else if (key_code_ === this.m_kb_upleft_key_code) {
			this.m_kb_upleft_pressed = is_pressed_;
		} else if (key_code_ === this.m_kb_shift_key_code) {
			this.m_kb_shift_pressed = is_pressed_;
		} else if (key_code_ === this.m_kb_space_key_code) {
			this.m_kb_space_pressed = is_pressed_;
		} else if (key_code_ === this.m_kb_enter_key_code) {
			this.m_kb_enter_pressed = is_pressed_;
		} else if (key_code_ === this.m_kb_esc_key_code) {
			this.m_kb_esc_pressed = is_pressed_;
		}
	}
}
