const InsetCard = ({ children }) => {
  return <div className="bg-[#f7f7f7]
                                    p-4 px-5
                                    rounded-[10px]
                                    border border-[#e4e4e4]
                                    shadow-[inset_0_2px_5px_rgba(0,0,0,0.12),inset_0_-2px_4px_rgba(255,255,255,0.8)]
                                    mt-2 mb-6
                                    max-h-[200px]
                                    overflow-y-auto
                                    ">
                                        {children}
                                    </div>;
};

export default InsetCard;
