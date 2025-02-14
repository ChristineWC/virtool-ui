import { EditTarget, mapDispatchToProps, mapStateToProps } from "../Edit";
import { TargetForm } from "../Form";

describe("<EditTarget />", () => {
    let props;
    let e;

    beforeEach(() => {
        e = {
            preventDefault: vi.fn()
        };

        props = {
            name: "Bar",
            description: "Bar description",
            length: 490,
            refId: "foo",
            required: true,
            onSubmit: vi.fn(),
            onHide: vi.fn(),
            show: true,
            targets: [
                {
                    name: "Foo",
                    description: "Foo description",
                    length: 540,
                    required: true
                },
                {
                    name: "Bar",
                    description: "Bar description",
                    length: 490,
                    required: true
                },
                {
                    name: "Baz",
                    description: "Baz description",
                    length: 490,
                    required: true
                }
            ]
        };
    });

    it("should render", () => {
        const wrapper = shallow(<EditTarget {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render error when submitted without name", () => {
        const wrapper = shallow(<EditTarget {...props} />);
        wrapper.setState({
            name: "",
            description: "This is a test",
            length: 310,
            required: false
        });
        wrapper.find("form").simulate("submit", e);
        expect(props.onHide).not.toHaveBeenCalled();
        expect(props.onSubmit).not.toHaveBeenCalled();
        expect(wrapper).toMatchSnapshot();
    });

    it("should should call onSubmit() when name provided", () => {
        const wrapper = shallow(<EditTarget {...props} />);
        wrapper.setState({
            name: "CPN60",
            description: "This is a test",
            length: 310,
            required: false
        });
        wrapper.find("form").simulate("submit", e);
        expect(props.onSubmit).toHaveBeenCalledWith("foo", {
            targets: [
                {
                    name: "Foo",
                    description: "Foo description",
                    length: 540,
                    required: true
                },
                {
                    name: "CPN60",
                    description: "This is a test",
                    length: 310,
                    required: false
                },
                {
                    name: "Baz",
                    description: "Baz description",
                    length: 490,
                    required: true
                }
            ]
        });
        expect(props.onHide).toHaveBeenCalledWith();
    });

    it("should update when TargetForm onChange() prop called", () => {
        e.target = {
            name: "name",
            value: "Foo",
            checked: true
        };
        const wrapper = shallow(<EditTarget {...props} />);
        wrapper.find(TargetForm).prop("onChange")(e);
        expect(wrapper).toMatchSnapshot();
    });

    it("should set initial state on open", () => {
        props.show = false;
        const wrapper = shallow(<EditTarget {...props} />);
        wrapper.setState({ name: "CPN60", description: "This is a test" });
        wrapper.setProps({ show: true });
        setTimeout(() => expect(wrapper).toMatchSnapshot(), 500);
    });
});

describe("mapStateToProps()", () => {
    let state;

    beforeEach(() => {
        state = {
            references: {
                detail: {
                    id: "baz",
                    targets: [
                        { name: "foo", description: "bar", length: 1, required: false },
                        { name: "Foo", description: "Bar", length: 2, required: true }
                    ]
                }
            },
            router: { location: { state: { editTarget: "foo" } } }
        };
    });

    it("should return props when name matches a target", () => {
        const result = mapStateToProps(state);
        expect(result).toEqual({
            targets: [
                { name: "foo", description: "bar", length: 1, required: false },
                { name: "Foo", description: "Bar", length: 2, required: true }
            ],
            name: "foo",
            description: "bar",
            length: 1,
            required: false,
            refId: "baz",
            show: true
        });
    });

    it("should return props when name does not match a target", () => {
        state.router.location.state = {};
        const result = mapStateToProps(state);

        expect(result).toEqual({
            targets: [
                { name: "foo", description: "bar", length: 1, required: false },
                { name: "Foo", description: "Bar", length: 2, required: true }
            ],
            name: undefined,
            description: undefined,
            length: undefined,
            required: undefined,
            refId: "baz",
            show: false
        });
    });
});

describe("mapDispatchToProps()", () => {
    it("should return onSubmit in props", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);
        props.onSubmit("foo", "bar");
        expect(dispatch).toHaveBeenCalledWith({
            payload: { refId: "foo", update: "bar" },
            type: "EDIT_REFERENCE_REQUESTED"
        });
    });
});
