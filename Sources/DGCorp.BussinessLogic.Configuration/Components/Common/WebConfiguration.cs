using System;
using System.Collections.Generic;
using System.Text;

namespace DGCorp.BussinessLogic.Configuration.Components.Common
{
    public interface IWebConfiguration
    {
        int Port { get; }
    }

    public class WebConfiguration : IWebConfiguration, IConfigurationModuleIniter
    {
        public WebConfiguration()
        {

        }

        public int Port { get; private set; }

        public void InitModuleConfiguration()
        {
            throw new NotImplementedException();
        }
    }
}
